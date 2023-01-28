import Permission from "./Permission.js";
import Role, { loadRole } from "./Role.js";
import RoleHasPermission from "./RoleHasPermission.js";

const loadRolePermission = async () => {


    await loadRole()



    await Permission.sync({
        alter: true
    })


    await RoleHasPermission.sync({
        alter: true
    })


    Role.belongsToMany(Permission, {
        through: 'rolehaspermissions', as: "permissions",
        foreignKey: "role_id",
        otherKey: "permission_id",
        constraints: false
    })


    Permission.belongsToMany(Role, {
        through: 'rolehaspermissions', as: "role",
        foreignKey: "permission_id",
        otherKey: "role_id",
        constraints: false
    })

}

export default loadRolePermission