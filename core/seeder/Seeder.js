import Permission from "../service/RolePermission/Permission.js"
import Role from "../service/RolePermission/Role.js"

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

const admins = [
    { name: "admin", },
    { name: "customer" }

]


const seeder = async () => {

    let alreadySeed = await Permission.findAll()
    if (alreadySeed.length>0) {
        console.log("already Seeding")
        return
    }

    for (let permission of permissions) {
        console.log(permission)
        await Permission.create({ name: permission })
    }
    await Role.bulkCreate(admins)


    let admin = await Role.findOne({ where: { name: "admin" } })
    if (admin) {
        console.log(admin.name)
        await admin.syncPermissions(permissions)
    }
    let customer = await Role.findOne({ where: { name: "customer" } })
    if (customer) {
        await customer.syncPermissions([
            "user-create", "user-stored",
        ])
    }

}

export default seeder