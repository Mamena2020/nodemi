# Nodemi

Template backend for nodejs.

- feature
   - Jwt auth
   - Request validation
   - ORM
   - File request handling
   - Media binding to any Model
   - Role and Permissions

- Model
   
   Create new model via cli
   
   ```
      npx nodemi make:model Product
   ```
   
  The model product will be created in the models directory. and automatically registered in loadModels(), in the core/model/models directory.
   
   
   ```
      import { Model, DataTypes } from "sequelize";
      import db from "../core/database/database.js"
      
      class Product extends Model {}
      Product.init({
           name: {
             type: DataTypes.STRING,
             allowNull: false
           },
         }, {
           sequelize: db, 
           modelName: 'Product',
           timestamps: true
         }
      );

     export default Product
    ```
    
    Directory core/model/models.js
   
    ``` 
      const loadModels = async () => {
         await Product.sync({
             alter: true, // not recomended on production mode
         })
          ....
    ```
    
    Full <a target="_blank" href="https://sequelize.org/docs/v6/core-concepts/model-basics/"> documentation </a> of ORM
 
 - Media
 
   Any model can own media by binding the model to the media inside the loadModels function using hasMedia
   ```
      const loadModels = async () => {
         await Product.sync({
             alter: true, // not recomended on production mode
         })
    
      await hasMedia(Product)
    
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
   
 - Request
    
   Handling Content-Type header for
     - application/json 
     - application/form-data 
     - application/x-www-form-urlencoded
   
   Handling all upload files

 - Validation 
 
   Create Request validation via cli
   
   ```
      npx nodemi make:request ProductRequest
   ```
   The Request will be created in the requests directory
   ```
      import RequestValidation from "../core/validation/RequestValidation.js"
     
      class ProductRequest extends RequestValidation {
     
          constructor(req) {
              super(req).load(this)
          }

          rules() {
              return {

              }
          }
       }

       export default ProductRequest
   ```
   #Example
   
   
   
   
   - Rules
   ```
    required
    email
    match                 // "match:password"
    string
    float
    integer
    max                   //   "max:4"
    min                   //   "min:1" 
    date 
    array
    exists                // "exists:users,email"  | "exists:users,email,"+super.body.id
    unique                // "unique:users,email"  | "unique:users,email,"+super.body.id
    mimetypes             // "mimetypes:image/webp,image/x-icon,video/mp4"
    mimes                 // "mimes:jpg,png"
    maxfile               // "maxfile:1,GB" "maxfile:1,MB"  |"maxfile:1,KB"  |"maxfile:1,Byte"
    image                
    date_after            // "date_after:now" | "date_after:birthdate"
    date_after_or_equal   // "date_after_or_equal:now"
    date_before           // "date_before:now"
    date_before_or_equal  // "date_before_or_equal:now"
    bolean       
    in_array              // "in_array:1,3,4,1,4,5"
    not_in_array          // "not_in_array:1,3,4,1,4,5"
    ip
    url
    json
    digit                 // "digit:4"

   ```






#todo 

 

- request 
 - max_digit
 - min_digit
 - digit between
- role permission


