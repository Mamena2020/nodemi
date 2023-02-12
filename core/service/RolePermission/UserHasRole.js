import { Model, DataTypes } from "sequelize";
import db from "../../database/Database.js";

class UserHasRole extends Model {

}


UserHasRole.init({
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Roles",
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    roleable_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roleable_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        sequelize: db, // We need to pass the connection instance
        tableName: "UserHasRoles",
        modelName: 'UserHasRole', // We need to choose the model name
        timestamps: true
    }
)





export default UserHasRole
