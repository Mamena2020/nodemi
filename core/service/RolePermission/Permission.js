import { Model, DataTypes } from "sequelize";
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
        tableName: "Permissions",
        modelName: 'Permission', // We need to choose the model name
        timestamps: true
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
            await db.query(`ALTER TABLE Permissions DROP INDEX name`).then(() => {
            })
        }
    } catch (error) {
        console.log("error")
    }
}


export default Permission
export {
    permissionType,
    loadPermission
}