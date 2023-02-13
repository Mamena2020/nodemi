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
    sequelize: db, // We need to pass the connection instance
    tableName: "user_details",// table name
    modelName: 'UserDetail', //  model name
    timestamps: true
});



export default UserDetail