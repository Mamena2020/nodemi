import Permission, { loadPermission } from "./Permission.js";
import Role, { loadRole } from "./Role.js";
import RoleHasPermission from "./RoleHasPermission.js";

const loadRolePermission = async () => {


    await loadRole(true)

    await loadPermission(true)

    await RoleHasPermission.sync({
        alter: true
    })


    Role.belongsToMany(Permission, {
        // through: 'rolehaspermissions', as: "permissions",
        through: RoleHasPermission,
        foreignKey: "role_id",
        otherKey: "permission_id",
        constraints: false
    })


    Permission.belongsToMany(Role, {
        through: RoleHasPermission,
        foreignKey: "permission_id",
        otherKey: "role_id",
        constraints: false
    })

}

/**
 * 
 * @param {*} user user model
 * @param {*} permissions ["product-access","product-stored"]
 * @returns 
 */
const GateAccess = (user, permissions = []) => {

    if (!Array.isArray(permissions))
        throw "permissions must be an array"

    if (!user || !user.role || !user.role.permissions)
        return false
    let countValid = 0
    for (let permission of user.role.permissions) {
        if (permissions.includes(permission.name)) {
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
