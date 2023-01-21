import { Model, DataTypes } from "sequelize";
import db from "../config/database/Database.js"
import { v4 as uuid4 } from 'uuid'
import multer from "multer";
// Helper function
const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`;


class Media extends Model {

    // getMediatable(options) {
    //     if (!this.mediatable_type) return Promise.resolve(null);
    //     const mixinMethodName = `get${uppercaseFirst(this.mediatable_type)}`;
    //     return this[mixinMethodName](options);
    // }
}




Media.init({
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mediatable_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mediatable_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        sequelize: db, // We need to pass the connection instance
        tableName: "Medias",
        modelName: 'Media', // We need to choose the model name
        timestamps: true
    })

Media.loadSync = async function ({ alter = false }) {
    // handling for multiple index of url
    try {
        await db.query(`ALTER TABLE Medias DROP INDEX url`).then(() => {
        })
    } catch (error) {
        console.log("error")
    }
    await Media.sync({
        alter: alter,
    })
}

const hasMedia = async (model = Model) => {
    model.hasMany(Media, {
        foreignKey: 'mediatable_id',
        constraints: false,
        scope: {
            mediatable_type: model.modelName
        }
    })
    Media.belongsTo(model, { foreignKey: 'mediatable_id', constraints: false });

    model.prototype.saveMedia = async function (file, name) {
        saveMedia({
            file: file,
            model: this,
            name: name
        })
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage });

// const save = async ({ model = Model, file = any, name = String }) => {
const saveMedia = async ({ model = Model, file = null, name = String }) => {
    console.log("------------- savemedia1")
    if (!file) {
        console.log("no file")
        return
    }
    console.log(file)

    if (!name) {
        name = uuid4()
    }
    const mediatable_id = model.id
    const mediatable_type = model.constructor.options.name.singular
    console.log("------------- savemedia2")
    console.log(mediatable_id)
    console.log(mediatable_type)
    console.log("------------- savemedia3")

    const media = await Media.findOne({
        where: {
            mediatable_id: mediatable_id,
            mediatable_type: mediatable_type,
            name: name
        }
    })

    const uploadFile = await upload.single(file)

    console.log("uploadFile", uploadFile)
    const url = "";

    if (!media) {
        await Media.create({
            mediatable_id: mediatable_id,
            mediatable_type: mediatable_type,
            url: url,
            name: name
        })
    }
    else {
        await media.update({
            url: url
        })
    }
}


// exports.Media = Media
// exports.hasMedia = hasMedia

export default Media
export { hasMedia, saveMedia }
// module.exports = {
//     Media,
//     hasMedia
// }