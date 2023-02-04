import Permission, { loadPermission } from "./Permission.js";
import Role, { loadRole } from "./Role.js";
import RoleHasPermission from "./RoleHasPermission.js";


/**
 * load role & permissions model
 */
const loadRolePermission = async () => {


    await loadRole(true)

    await loadPermission(true)

    await RoleHasPermission.sync({
        alter: true
    })


    Role.belongsToMany(Permission, {
        through: RoleHasPermission,
        foreignKey: "role_id",
        otherKey: "permission_id",
        constraints: false
        // through: 'rolehaspermissions', as: "permissions",
    })


    Permission.belongsToMany(Role, {
        through: RoleHasPermission,
        foreignKey: "permission_id",
        otherKey: "role_id",
        constraints: false
    })

}

/**
 * Checking user that has particular permissions
 * @param {*} user user model
 * @param {*} permissions ["product-access","product-stored"]
 * @returns 
 */
const GateAccess = (user, permissions = []) => {

    if (!Array.isArray(permissions))
        throw "permissions must be an array"
    let permissionsName = user.getPermissionsName()

    if (!permissionsName)
        return false

    let countValid = 0
    for (let permission of permissionsName) {
        if (permissions.includes(permission)) {
            countValid++
        }
    }

    if (countValid !== permissions.length)
        return false

    return true
}


export default loadRolePermission
export {
    GateAccess
}
