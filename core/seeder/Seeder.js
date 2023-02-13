import Permission from "./../service/RolePermission/Permission.js"
import Role from "./../service/RolePermission/Role.js"

// const permissions = [
//     { name: "user-create" },
//     { name: "user-stored" },
//     { name: "user-edit" },
//     { name: "user-update" },
//     { name: "user-delete" },
//     { name: "user-search" }
// ]
const permissions = [
    "user-create",
    "user-stored",
    "user-edit",
    "user-update",
    "user-delete",
    "user-search"
]

const roles = [
    { name: "admin", },
    { name: "customer" }
]

/**
 * running seeder code in here
 * 
 * Cli command: npx nodemi seed:run
 * @returns 
 */
const Seeder = async () => {

    let alreadySeed = await Permission.findAll()

    if (alreadySeed.length > 0) {
        console.log("already Seeding")
        return
    }

    for (let permission of permissions) {
        console.log(permission)
        await Permission.create({ name: permission })
    }

    await Role.bulkCreate(roles)

    let admin = await Role.findOne({ where: { name: "admin" } })
    if (admin) {
        await admin.assignPermissions(permissions)
    }

    let customer = await Role.findOne({ where: { name: "customer" } })
    if (customer) {
        await customer.assignPermissions([
            "user-create", "user-stored",
        ])
    }

}

export default Seeder