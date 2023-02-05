import { Model, DataTypes, Sequelize } from "sequelize";
import db from "../../database/database.js";
import Permission from "./Permission.js";
import RoleHasPermission from "./RoleHasPermission.js";
import UserHasRole from "./UserHasRole.js";

class Role extends Model {

}


Role.init({
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
},
    {
        sequelize: db, // We need to pass the connection instance
        tableName: "Roles",
        modelName: 'Role', // We need to choose the model name
        timestamps: true
    }
)




/**
 * Binding any model to role, so any model that binding with this function will have role
 * @param {*} model 
 */
const hasRole = async (model = Model) => {

    model.belongsToMany(Role, {
        through: UserHasRole,
        constraints: false,
        foreignKey: 'roleable_id'
    })

    Role.belongsToMany(model, {
        through: UserHasRole,
        constraints: false,
        foreignKey: "role_id"
    })

    let includeRolePermissions = {
        model: Role,
        include: {
            model: Permission
        }
    }

    model.addScope('withRole', {
        include: [includeRolePermissions]
    })

    model.options.defaultScope = model.options.defaultScope || {}
    model.options.defaultScope.method = model.options.defaultScope.method || []
    model.options.defaultScope.include = model.options.defaultScope.include || []

    model.options.defaultScope.include.push(includeRolePermissions)

    model.prototype.getRole = function () {
        return this.Roles && this.Roles[0] || null
    }

    model.prototype.getPermissions = function () {
        return this.Roles && this.Roles[0] && this.Roles[0].Permissions || null
    }
    model.prototype.getPermissionsName = function () {
        if (!this.Roles || !this.Roles[0])
            return

        let names = []
        for (let p of this.Roles[0].Permissions) {
            names.push(p.name)
        }
        return names
    }


    model.prototype.setRole = async function (role) {
        await setRole(
            this,
            role
        )
    }

    // model.prototype.removeRole = async function () {
    //     UserHasRole.destroy({
    //         where: {
    //             roleable_id: this.id,
    //             roleable_type: model.constructor.options.name.singular
    //         }
    //     })
    // }


    model.beforeBulkDestroy(async (instance) => {
        let _models = await model.findAll({
            where: instance.where
        })
        if (_models && _models.length > 0) {
            // console.log("_models: ", _models)
            for (let _model of _models) {
                UserHasRole.destroy({
                    where: {
                        roleable_id: _model.id,
                        roleable_type: instance.model.options.name.singular
                    }
                })
            }
        }
    })
}

/**
 * Binding role model to any model, so that model can have a role
 * @param {*} model 
 * @param {*} role 
 */
const setRole = async (model, role) => {

    try {

        // console.log("set role")
        // console.log("model.id", model.id)
        const roleable_id = model.id
        const roleable_type = model.constructor.options.name.singular


        const roleModel = await Role.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { id: role ?? '' },
                    { name: role ?? '' }
                ]
            }
        })

        if (!roleModel || !roleable_id || !roleable_type)
            throw "role not found"

        // console.log("roleModel.id", roleModel.id)
        // console.log("roleable_id", roleable_id)
        // console.log("roleable_type", roleable_type)

        const userRole = await UserHasRole.findOne({
            where: {
                roleable_id: roleable_id,
                roleable_type: roleable_type
            },
            attributes: ["id"]
        })


        if (userRole) {
            // console.log("update role model")
            await userRole.update({
                role_id: roleModel.id
            })
        }
        else {
            // console.log("create new role for user")
            await UserHasRole.create({
                role_id: roleModel.id,
                roleable_id: roleable_id,
                roleable_type: roleable_type
            })
        }
    } catch (error) {
        console.error(error)
    }



}


/**
 * Load role Model & UserHasModel
 * @param {*} alter 
 */
const loadRole = async (alter = false) => {


    await alterTableRoleHandling(alter)

    await Role.sync({
        alter: alter
    })

    Role.prototype.syncPermissions = async function (permissions) {
        syncPermissions(this, permissions)
    }


    await UserHasRole.sync({
        alter: alter
    })


    // UserHasRole.belongsToMany(Role, {
    //     foreignKey: 'role_id',
    //     as: 'role',
    //     through: "userhasroles",
    //     constraints: false,
    // })

    // Role.belongsToMany(UserHasRole, {
    //     through: 'userhasroles',
    //     as: 'user_has_role',
    //     foreignKey: 'role_id',
    //     constraints: false,
    // });

}

/**
  * Used for handling multiple index before alter role table 
 * @param {*} alter 
 */
const alterTableRoleHandling = async (alter = false) => {
    // handling for multiple index of url
    try {
        if (alter) {
            await db.query(`ALTER TABLE Roles DROP INDEX name`).then(() => {
            })
        }
    } catch (error) {
        console.log("error")
    }
}


/**
 * Assigning permission to a role
 * @param {*} role 
 * @param {*} permissions 
 */
const syncPermissions = async (role, permissions) => {
    try {
        await RoleHasPermission.destroy({
            where: {
                role_id: role.id
            }
        })

        if (Array.isArray(permissions)) {
            if (permissions.every(element => typeof element === "number")) {
                for (let id of permissions) {
                    try {
                        await RoleHasPermission.create({
                            role_id: role.id,
                            permission_id: id
                        })
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
            if (permissions.every(element => typeof element === "string")) {
                for (let name of permissions) {
                    try {
                        let permission = await Permission.findOne({ where: { name: name } })
                        if (permission) {
                            await RoleHasPermission.create({
                                role_id: role.id,
                                permission_id: permission.id
                            })
                        }
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        }
        else {

        }
    } catch (error) {
        console.error(error)
    }
}




export default Role
export { loadRole, hasRole }




// const { User, Task } = require('./models');

// User.defaultScope(function(options) {
//   const { withTasks } = options;
//   const scopes = {};

//   if (withTasks) {
//     scopes.include = [{
//       model: Task
//     }];
//   }

//   return scopes;
// });

// User.findAll({ withTasks: true })
// .then(users => {
//   console.log(users.map(user => user.toJSON()));
// })
// .catch(error => {
//   console.error(error);
// });