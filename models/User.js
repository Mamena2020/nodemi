import { Model, DataTypes } from "sequelize";
import db from "../core/database/database.js"


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
  // modelName: 'User', // We need to choose the model name
  modelName: 'User', // We need to choose the model name
  timestamps: true
});

export default User