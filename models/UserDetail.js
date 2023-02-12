import { Model, DataTypes } from "sequelize";
import db from "../core/database/Database.js"

class UserDetail extends Model { }

UserDetail.init({
    // Model attributes are defined here
    bio: {
        type: DataTypes.STRING,
        // allowNull: false,
        // defaultValue: 'new user'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: 'id'
        },
        onDelete: "CASCADE"
    }
}, {
    // tableName: "UserDetails",
    sequelize: db, // We need to pass the connection instance
    // modelName: 'UserDetails', // We need to choose the model name
    modelName: 'UserDetail', // We need to choose the model name
    timestamps: true
});



export default UserDetail