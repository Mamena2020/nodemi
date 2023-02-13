import { Model, DataTypes } from "sequelize";
import db from "../../database/Database.js";
import Permission from "./Permission.js";
import Role from "./Role.js";


class RoleHasPermission extends Model {

}


RoleHasPermission.init({
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
            // model: "Role",
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "permissions",
            // model: Permission,
            key: 'id'
        },
        onDelete: "CASCADE"
    }
},
    {
        sequelize: db, // We need to pass the connection instance
        tableName: "role_has_permissions",
        modelName: 'RoleHasPermission', // We need to choose the model name
        timestamps: true
    }
)

/**
 * Load RoleHasPermission
 * @param {*} alter 
 */
const loadRoleHasPermission = async function (alter = false) {
    await RoleHasPermission.sync({
        alter: alter
    })
}


export default RoleHasPermission
export { loadRoleHasPermission }