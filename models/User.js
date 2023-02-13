import { Model, DataTypes } from "sequelize";
import db from "../core/database/Database.js"


class User extends Model {
  
}

User.init({
  // Model attributes are defined here
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
    // allowNull defaults to true
  },

}, {
  sequelize: db, // We need to pass the connection instance
  tableName: 'users', // table name
  modelName: 'User', //  model name
  timestamps: true
});

export default User