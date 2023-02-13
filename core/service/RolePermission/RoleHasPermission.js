import { Model, DataTypes } from "sequelize";
import db from "../../database/Database_.js";

class RoleHasPermission extends Model {

}


RoleHasPermission.init({
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "permissions",
            key: 'id'
        },
        onDelete: "CASCADE"
    }
},
    {
        sequelize: db, // We need to pass the connection instance
        tableName: "RoleHasPermissions",
        modelName: 'RoleHasPermission', // We need to choose the model name
        timestamps: true
    }
)


export default RoleHasPermission