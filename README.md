# backend-node

Template backend for nodejs.

- feature
   - jwt auth
   - request validation
   - ORM
   - File request handling
   - Media binding to any Model

- Model
   
   Create new model, <a target="_blank" href="https://sequelize.org/docs/v6/core-concepts/model-basics/">full documentation </a>
   
   ```
      import { Model, DataTypes } from "sequelize";
      import db from "../core/database/database.js"
      
      class User extends Model {}
      User.init({
           name: {
             type: DataTypes.STRING,
             allowNull: false
           },
           email: {
             type: DataTypes.STRING,
             allowNull: false
           },
           password: {
             type: DataTypes.TEXT,
             allowNull: false
           },
           refresh_token: {
             type: DataTypes.TEXT,
           },
         }, {
           sequelize: db, 
           modelName: 'User',
           timestamps: true
         }
      );

     export default User
    ```
    
    Register model to core/model/models.js
   
    ``` 
    const loadModels = async () => {
       await User.sync({
           alter: true, // not recomended on production mode
       })
       ....
    ```
 
 - Media
 
   Binding a model to media inside loadModels function using hasMedia
   ```
    const loadModels = async () => {
    await User.sync({
        alter: true, // not recomended on production
    })
    // binding a model to media, "one to many polymorphism relation with media table"
    await hasMedia(User)
   ```
   Save a file 
   ```
    // save user avatar
    const user = await authUser(req)
    await user.saveMedia(
        req.body['file'],
        "avatar"
    )
    
    // save product image
    const product = await Product.findOne({
        where: {
          id: 1
        }
    }) 
    
    await product.saveMedia(req.body['file'],"product-image")
    
   ```
   
 - Reqeust
    
   Handling Content-Type header for
     - application/json 
     - application/form-data 
     - application/x-www-form-urlencoded
   Handling all upload files