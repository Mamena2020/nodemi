import { Model, DataTypes } from "sequelize";
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


const hasRole = async (model = Model) => {

    model.hasMany(UserHasRole, {
        as: 'role',
        foreignKey: 'table_id',
        constraints: false,
        scope: {
            table_type: model
        }
    })

    UserHasRole.belongsTo(model, { foreignKey: 'table_id', constraints: false });

    model.prototype.setRole = async function (role_id) {
        await setRole(
            this,
            role_id
        )
    }


    model.addHook("afterDestroy", (_model) => {
        UserHasRole.destroy({
            where: {
                table_id: _model.where.id,
                table_type: _model.constructor.name
            }
        })
    })

    model.addHook("afterFind", async function (_model) {
        // console.log("_model.constructor.name", _model.constructor.name)
        if (_model) {

            const _hasRole = await UserHasRole.findOne({
                where: {
                    table_id: _model.id,
                    table_type: _model.constructor.name
                }
            });
            if (_hasRole) {
                let role = await Role.findOne({
                    include: {
                        model: Permission,
                        as: "permissions"
                    },
                    where: {
                        id: _hasRole.role_id
                    }
                }) 
                _model.role = role
            }
        }
    })
}

const setRole = async (model, role_id) => {

    try {
        const table_id = model.id
        const table_type = model.constructor.options.name.singular

        if (!role_id)
            throw "role id not found"

        const userRole = await UserHasRole.findOne({
            where: {
                table_id: table_id,
                table_type: table_type
            }
        })

        if (userRole) {
            await userRole.update({
                role_id: role_id
            })
        }
        else {
            await UserHasRole.create({
                role_id: role_id,
                table_id: table_id,
                table_type: table_type
            })
        }
    } catch (error) {
        console.error(error)
    }



}



const loadRole = async () => {


    await Role.sync({
        alter: true
    })


    Role.prototype.syncPermissions = async function (permissions) {
        syncPermissions(this, permissions)
    }


    await UserHasRole.sync({
        alter: true
    })


    UserHasRole.belongsToMany(Role, {
        foreignKey: 'role_id',
        as: 'role',
        through: "userhasroles",
        constraints: false,
    })

    Role.belongsToMany(UserHasRole, {
        through: 'userhasroles',
        as: 'user_has_role',
        foreignKey: 'role_id',
        constraints: false,
    });







}



export default Role
export { loadRole, hasRole }