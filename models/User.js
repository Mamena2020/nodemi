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
    type: DataTypes.STRING,
    allowNull: true
  },
  verification_token: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  verified_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reset_token: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  reset_token_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  password_reset: {
    type: DataTypes.DATE,
    allowNull: true
  },

}, {
  sequelize: db, // We need to pass the connection instance
  tableName: 'users', // table name
  modelName: 'User', //  model name
  timestamps: true,
  underscored: true
});

export default User