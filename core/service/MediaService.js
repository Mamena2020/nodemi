import { Model, DataTypes } from "sequelize";
import { v4 as uuid4 } from 'uuid'
import path from 'path'
import fse from 'fs-extra'
import db from "../../core/database/database.js"
import mediaConfig from "../config/media.js";
import { unwatchFile } from "fs";
// Helper function
// const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`;


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
    info: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    local_storage: {
        type: DataTypes.BOOLEAN,
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
    }
)

Media.addHook("afterDestroy", async (media) => {
    try {
        if (media.local_storage) {
            await fse.remove(media.url)
        }
    } catch (error) {
    }
})

/**
 * Load media model
 * @param {*} param0 
 */
Media.loadSync = async function ({ alter = false }) {
    // handling for multiple index of url
    try {
        if (alter) {
            await db.query(`ALTER TABLE Medias DROP INDEX url`).then(() => {
            })
        }
    } catch (error) {
        console.log("error")
    }
    await Media.sync({
        alter: alter,
    })
}

// ------------------------------------------------------------------------------------------- binding with any model
/**
 * binding any model to media, so any model can have media 
 * @param {*} model 
 */
const hasMedia = async (model = Model) => {

    model.hasMany(Media, {
        // as: Media.name,
        foreignKey: 'mediatable_id',
        constraints: false,
        // scope: {
        //     mediatable_type: model
        // }
    })
    Media.belongsTo(model, { foreignKey: 'mediatable_id', constraints: false })

    let includeMedia = {
        model: Media,

    }

    model.addScope('withMedia', {
        include: [includeMedia]
    })

    model.options.defaultScope = model.options.defaultScope || {};
    model.options.defaultScope.method = model.options.defaultScope.method || [];
    model.options.defaultScope.include = model.options.defaultScope.include || []

    model.options.defaultScope.include.push(includeMedia)


    model.prototype.getMedia = function () {
        if (!this.Media)
            return
        if (this.dataValues.media)
            return this.dataValues.media

        let newMedia = []
        for (let m of this.Media) {
            if (m.local_storage) {
                m.url = normalizeLocalStorageToUrl(m.url)
            }
            newMedia.push(m)
        }
        this.dataValues.media = newMedia;
        this.dataValues.firstMedia = newMedia[0] || null
        return newMedia
    }
    model.prototype.getFirstMedia = function () {
        if (!this.Media)
            return
        if (this.dataValues.firstMedia)
            return this.dataValues.firstMedia

        let newMedia = []
        for (let m of this.Media) {
            if (m.local_storage) {
                m.url = normalizeLocalStorageToUrl(m.url)
            }
            newMedia.push(m)
        }
        this.dataValues.media = newMedia;
        this.dataValues.firstMedia = newMedia[0] || null
        return this.dataValues.firstMedia
    }

    model.prototype.saveMedia = async function (file, name) {
        await saveMedia({
            model: this,
            file: file,
            name: name
        })
    }

    model.prototype.destroyMedia = async function (name) {
        if (!name)
            throw "need media name"

        await Media.destroy({
            where: {
                name: name,
                mediatable_id: this.id,
                mediatable_type: this.constructor.name
            }
        })
    }


    model.addHook("afterDestroy", (_model) => {
        Media.destroy({
            where: {
                mediatable_id: _model.where.id,
                mediatable_type: _model.constructor.name
            }
        })
    })
}

// ------------------------------------------------------------------------------------------- store file functions
/**
 * store media to local storage
 * @param {*} file 
 * @param {*} mediatable_type 
 * @param {*} mediatable_id 
 * @returns 
 */
const saveToLocal = async (file, mediatable_type, mediatable_id) => {
    return await new Promise(async (resolve, reject) => {
        const folderName = mediaConfig.localStorageDirectory + "/" + mediatable_type + "-" + mediatable_id
        const fileName = uuid4() + file.extension
        const targetDir = path.join(folderName, fileName);
        // create folder if not exist
        if (!fse.existsSync(folderName)) {
            await fse.mkdirSync(folderName, { recursive: true });
        }

        await fse.move(file.tempDir, targetDir, (err) => {
            if (err) {
                console.log("error when rename file to permanent storage")
                console.log(err);
                return reject(err);
            }
            return resolve(targetDir)
        })
    })
}



/**
 * save a media 
 * @param { model = Model, file = Object, name = String } 
 * @returns 
 */
const saveMedia = async ({ model = Model, file = Object, name = String }) => {
    if (!file || !name || !model) {
        console.log("require all params")
        return
    }
    const mediatable_id = model.id
    const mediatable_type = model.constructor.options.name.singular


    var targetDir
    if (mediaConfig.usingLocalStorage) {
        targetDir = await saveToLocal(file, mediatable_type, mediatable_id)
    }
    if (targetDir) {

        delete file.tempDir

        const media = await Media.findOne({
            where: {
                mediatable_id: mediatable_id,
                mediatable_type: mediatable_type,
                name: name
            }
        })
        if (!media) {
            await Media.create({
                mediatable_id: mediatable_id,
                mediatable_type: mediatable_type,
                url: targetDir,
                info: JSON.stringify(file),
                name: name,
                local_storage: mediaConfig.usingLocalStorage
            })
        }
        else {
            try {
                await fse.remove(media.url)
            } catch (error) {
            }
            await media.update({
                url: targetDir,
                info: JSON.stringify(file),
                local_storage: mediaConfig.usingLocalStorage
            })
        }
    }

    return targetDir
}
// -------------------------------------------------------------------------------------------  helpers
/**
 * normalize media path to url
 * ex: path   =>  /storage/user-1/image.jpg
 *     result => http://localhost:8000/storage/user-1/image.jpd
 * @param {*} filePath 
 * @returns url
 */

const normalizeLocalStorageToUrl = (filePath) => {
    let directories = filePath.split(path.sep)
    directories = directories.slice(1) // remove first path ->  /storage/
    let newPath = directories.join(path.sep)
    return mediaConfig.root_media_url + newPath.replace(/\\/g, "/")
}
// ------------------------------------------------------------------------------------------- 
/**
 * load media model
 */
const loadMedia = async () => {
    await Media.loadSync({
        alter: true
    })
}

// ------------------------------------------------------------------------------------------- 

export default Media
export { hasMedia, loadMedia }
