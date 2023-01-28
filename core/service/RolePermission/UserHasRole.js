import { Model, DataTypes } from "sequelize";
import db from "../../database/database.js";

class UserHasRole extends Model {

}


UserHasRole.init({
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
            key: 'id'
        },
        onDelete: "CASCADE"
    },
    table_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    table_type: {
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
