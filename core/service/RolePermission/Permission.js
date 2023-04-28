import { Model, DataTypes } from "sequelize";
import databaseConfig from "../../config/Database.js";
import db from "../../database/Database.js";


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
        tableName: "permissions",
        modelName: 'Permission', // We need to choose the model name
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)


/**
 * Load permisssions model 
 * @param {*} alter 
 */
const loadPermission = async (alter = false) => {
    await alterTablePermissionHandling(alter)
    await Permission.sync({
        alter: alter
    })

}

/**
 * Used for handling multiple index before alter permissions table 
 * @param {*} alter 
 */
const alterTablePermissionHandling = async (alter = false) => {
    // handling for multiple index of url
    try {
        if (alter) {
            await db.query(`ALTER TABLE permissions DROP INDEX name`).then(() => {
            })
        }
    } catch (error) {
        if (databaseConfig.dialect == "mysql") {
            console.log("Failed alter permissions drop index name, permissions not exist yet")
        }
    }
}


export default Permission
export {
    permissionType,
    loadPermission
}