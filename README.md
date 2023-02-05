# Nodemi

Template backend for nodejs.

- Features
   - Jwt auth
   - Request validation
   - Model - ORM
   - File request handling
   - Media binding to any Model
   - Role and Permissions
   - Resources

# Model
   
  Create new model via cli.
   
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
 
 # Media
 
   Any model can own media by binding the model to the media inside the loadModels function using hasMedia.

   ```
      const loadModels = async () => {

         await Product.sync({
             alter: true, // not recomended on production mode
         })
    
         await hasMedia(Product)
    
   ```
   
   - Save a file 
   
   If the model already has a file with the same name, then the file will be replaced with a new file. All media stored in storage directory by default.
   
   ```
      // save user avatar
      const user = await authUser(req)

      await user.saveMedia(
          req.body.file,
          "avatar"
      )

      // save product image
      const product = await Product.findOne({
          where: {
                id: 1
          }
      }) 

      await product.saveMedia(req.body.file,"product-image")
    
   ```
   
   - Get media
   
   Get all media by calling getMedia() or getFirstMedia() for first media 
   
   ```
      const product = await Product.findOne({
          where: {
                id: 1
          }
      })
      
      product.getMedia() // return list of object
      product.getFirstMedia() // return single object
      product.getFirstMedia().url // return first media url
      

   ```
   
   - Destroy media
   
   Destroy media by calling destroyMedia(mediaName) 
   
   ```
      const product = await Product.findOne({
          where: {
                id: 1
          }
      })

      product.destroyMedia("product-image")
      
   ```
   
 # Request
   
   Handling Content-Type header for
   
      - application/json 
      - application/form-data 
      - application/x-www-form-urlencoded
   
   Handling all upload files and nested field

 # Validation 
 
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

   - Basic usage

   ```
     
      const valid = new ProductRequest(req)

      await valid.check()

      if (valid.isError)
         return valid.responseError(res) // or  return res.status(422).json(valid.errors)
   
   ```
   
   - Example html form 

   ```
      <form action="http://localhost:5000/api/validation"  method="post" enctype="multipart/form-data">
         <div class="row justify-content-center d-flex">
            <div class="col-md-10">
                <label>Item</label>
                <input class="form-control my-2" type="text" name="name" placeholder="name" />
                <input class="form-control my-2" type="text" name="discount" placeholder="discount" />
                <input class="form-control my-2" type="date" name="expired_date" placeholder="expired date" />
                <input class="form-control my-2" type="file" name="product_image" placeholder="file" />
            </div>
            <div class="col-md-10">
                <label>Item 1</label>
                <input class="form-control my-2" type="text" name="item[0][name]" placeholder="name" />
                <input class="form-control my-2" type="text" name="item[0][description]" placeholder="description" />
                <input class="form-control my-2" type="text" name="price[0]" placeholder="price " />
            </div>
            <div class="col-md-10 mt-5">
                <label>Item 2</label>
                <input class="form-control my-2" type="text" name="item[1][name]" placeholder="name" />
                <input class="form-control my-2" type="text" name="item[1][description]" placeholder="description" />
                <input class="form-control my-2" type="text" name="price[1]" placeholder="price" />
            </div>
            
                <input type="text" name="comments[]" />
                <input type="text" name="comments[]" />
                <input type="text" name="comments[]" />
                <input type="text" name="comments[]" />

            <div class="col-md-10 my-2 ">
                <button class="float-end btn btn-primary" type="submit">Submit</button>
            </div>
         </div>
      </form>
   
   ```
       
   - Example rules
   
   ```
      rules() {
        return {
            "name": {
                "rules": ["required"]
            },
            "discount": {
                "rules": ["required", "float", "min:3", "max:4"]
            },
            "expired_date": {
                "rules": ["required", "date", "date_after:now"]
            },
            "product_image": {
                "rules": ["required", "image", "max_file:1,MB"]
            },
            "item.*.name": {
                "rules": ["required"]
            },
            "item.*.description": {
                "rules": ["required"]
            },
            "price.*": {
                "rules": ["required", "float"]
            },
            "comments.*": {
                "rules": ["required"]
            }
        }
      }

   ```
   
   - Example error response
   
   ```
      {
        "errors": {
             "name": [
               "The Name is required"
             ],
             "discount": [
               "The Discount is required",
               "The Discount must be valid format of float",
               "The Discount should be more or equal than 3",
               "The Discount should be less or equal than 4"
             ],
             "expired_date": [
               "The Expired date is required",
               "The Expired date must be valid format of date",
               "The Expired date date must be after the now's date"
             ],
             "product_image": [
               "The Product image is required"
             ],
             "item.0.name": [
               "The Item.0.name is required"
             ],
             "item.1.name": [
               "The Item.1.name is required"
             ],
             "item.0.description": [
               "The Item.0.description is required"
             ],
             "item.1.description": [
               "The Item.1.description is required"
             ],
             "price.0": [
               "The Price.0 is required",
               "The Price.0 must be valid format of float"
             ],
             "price.1": [
               "The Price.1 is required",
               "The Price.1 must be valid format of float"
             ],
             "comments.0": [
               "The Comments.0 is required"
             ],
             "comments.1": [
               "The Comments.1 is required"
             ],
             "comments.2": [
               "The Comments.2 is required"
             ],
             "comments.3": [
               "The Comments.3 is required"
             ]
         }
      }
   
   ```
   
   - List of rules
   
   ```
       required
       email
       match                 // "match:password"
       string
       float
       integer
       max                   // "max:4"
       min                   // "min:1" 
       date 
       array
       exists                // "exists:users,email"  | "exists:users,email,"+super.body.id
       unique                // "unique:users,email"  | "unique:users,email,"+super.body.id
       mimetypes             // "mimetypes:image/webp,image/x-icon,video/mp4"
       mimes                 // "mimes:jpg,png"
       max_file               // "max_file:1,GB" | "max_file:1,MB"  | "max_file:1,KB"  | "max_file:1,Byte"
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
       digits                // "digits:4"
       max_digits            // "max_digits:20"
       min_digits            // "min_digits:20"
       digits_between        // "digits_between:5,10"

   ```

   - Custom 
     
     Custom validation messages and attribute
    
   ```
       rules() {
        return {
             "name": {
                "rules": ["required"],
                "attribute": "Product name"
             },
             "discount": {
                "rules": ["required", "float", "min:3", "max:4"],
                "messages": {
                    "required": "Need discount",
                    "float": "The data must be numeric"
                },
                "attribute": "DISCOUNT"
               
            }
       }
   
   ```
   

# Role and Permissions
   
  A User model can have a role by binding using hasRole(YourModel) function inside loadModels on core/model/models.js
  
   ```
      const loadModels = async () => {
      
         await User.sync()
         
         await hasRole(User)
     
   ```

  - Set users role
  
  If the user already has a role, then the user role will be replaced with a new role. setRole() params can be role id or name
   
   ```
      let user = await User.create({
            name: name,
            email: email,
            password: hashPassword
      })

      user.setRole("customer") // role id or name
      
   ```
   
   
  - Get role 
  
  Get role object by calling YourModel.getRole(), or YourModel.getRole().name 
   
   ```
      user.getRole() // role object
      user.getRole().name // role name
   
   ```
   
  - Get permissions 
  
  Get permission by calling YourModel.getPermissions() will get array of object, or YourModel.getPermissionsName() will get array of permissions name
   
   ```
      
      user.getPermissions()     //  array of permissions object
      user.getPermissionsName() //  array of permissions name [ "user-create","user-stored"]
   
   ```
   
  - Check user access

   ```
    
       if (!GateAccess(user, ["user-create","user-stored","user-access"])) return res.sendStatus(403)

   ```
   
  - Add permissions
   
   ```
      const permissions = [
          "user-create",
          "user-stored",
          "user-edit",
          "user-update",
          "user-delete",
          "user-search"
      ]
      
       for (let permission of permissions) {
           await Permission.create({ name: permission })
       }
       
   ```
   
  - Add Role
   
   ```
       const roles = [ "admin","customer" ]       
      
       for (let role of roles) {
           await Role.create({ name: role })
       }
       
   ```
   
  - Assigning Permissions to Roles
   
   Assign permissions to a role can be a list of permissions name or id
   
   ```
       const permissions = [
          "user-create",
          "user-stored"
       ]
       
       let admin = await Role.findOne({ where: { name: "admin" } })

       if (admin) {
           await admin.syncPermissions(permissions)
       }
       
   ```

# Resource
   
  Create new resource via cli.
   
   ```
      npx nodemi make:resource UserResource
   ```

   The Resource will be created in resources directory

   ```
      import Resource from "../core/resource/Resource.js"
      class UserResource extends Resource {
          constructor(req) {
              super(req).load(this)
          }

          toArray(data) {
               return {}
          }
       }

       export default UserResource

   ```

   - Basic usage

   To make resource of single object use "make" or "collection" for array of object 

   ```
        let userResource = new UserResource().make(user) // for single object

        let userResources = new UserResource().collection(users) // for array of object

   ```

   - Example Resource

   ``` 
      // user resource
      class UserResource extends Resource {
          constructor(req) {
              super(req).load(this)
          }

          toArray(data) {
              return {
                        "id": data.id,
                        "name": data.name,
                        "email": data.email,
                        "image": data.getFirstMedia()?.url || '',
                        "role": data.getRole()?.name || '',
                        "permissions": new PermissionResource().collection(data.getPermissions() || []),
                    }
          }
       }

      // permissions resource
      class PermissionResource extends Resource {
          constructor() {
                super().load(this)
            }

            toArray(data) {
                return {
                    "id": data.id,
                    "name": data.name
                }
          }
      }

   ```
 
   - Example calling
   
   ```
      const user = await User.findOne({
          where: {
                id: 1
          }
      }) 

      let userResource =  new UserResource().make(user)

      res.json(userResource)

   ```

   - Example result

   ```
      {
          "id": 1,
          "name": "Andre",
          "email": "andre@gmail.com",
          "image": "http://localhost:5000/User-1/287d735a-2880-4d4f-9851-5055d1ba1aae.jpg",
          "role": "customer",
          "permissions": [
              {
                  "id": 1,
                  "name": "user-create"
              },
              {
                  "id": 2,
                  "name": "user-stored"
              }
          ]
      }
      
   ```

# Auth Jwt
  
   - Create token 
   
   Create token by calling JwtAuth.createToken(), that will return refresh token and access token

   ```
      const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        }
     
      const token = JwtAuth.createToken(payload)
     
      console.log(token.refreshToken)
      console.log(token.accessToken)


   ```

   - Regenerate access token

   Regenerate access token by calling JwtAuth.regenerateAccessToken(), that will return new access token

   ```

      let accessToken = JwtAuth.regenerateAccessToken(refreshToken)

   ```

   - Get Auth user

   Get authenticated user by calling JwtAuth.getUser(), that will get user by refresh token on request cookies

   ```
      const user = await JwtAuth.getUser(req)


   ```

   - Middleware auth

   For secure access to controller by adding JwtAuthPass to router.

   
   ```
      routerAuth.use(JwtAuthPass)
      routerAuth.get("/upload", UserController.upload)
       
      app.use("/api",routerAuth) 
      
   ```