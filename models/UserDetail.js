import { Model, DataTypes } from "sequelize";
import db from "../config/database/Database.js"
import User from "./User.js";

class UserDetail extends Model { }

UserDetail.init({
    // Model attributes are defined here
    bio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    // tableName: "UserDetails",
    sequelize: db, // We need to pass the connection instance
    modelName: 'UserDetail', // We need to choose the model name
    timestamps: true
});

export default UserDetail