import UserResource from "./UserResource.js"
import User from "../models/User.js";



let users = await User.findAll()
console.log(users)
let resources = new UserResource().collection(users)

// console.log(resources)

