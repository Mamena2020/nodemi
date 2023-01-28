import { Model, DataTypes } from "sequelize";
import db from "../../database/database.js";


const permissionType = Object.freeze({
    create: "create",
    store: "stored",
    edit: "edit",
    update: "update",
    delete: "delete",
    show: "show",
    search: "search"
})


class Permission extends Model {

}

Permission.init({
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
},
    {
        sequelize: db, // We need to pass the connection instance
        tableName: "Permissions",
        modelName: 'Permission', // We need to choose the model name
        timestamps: true
    }
)

export default Permission
export {
    permissionType
}