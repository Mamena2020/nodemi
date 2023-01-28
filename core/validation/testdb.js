

import User from '../../models/User.js'


let users = await User.findAll()

console.log(users)