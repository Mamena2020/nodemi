import { Model, DataTypes } from "sequelize";
import { v4 as uuid4 } from 'uuid'
import path from 'path'
import fse from 'fs-extra'
import db from "../database/Database.js"
import mediaConfig from "../config/Media.js";
import databaseConfig from "../config/Database.js";


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
        tableName: "medias",
        modelName: 'Media', // We need to choose the model name
        timestamps: true
    }
)


/**
 * Load media model
 * @param {*} param0 
 */
Media.loadSync = async function ({ alter = false }) {
    // handling for multiple index of url
    try {
        if (alter) {
            await db.query(`ALTER TABLE medias DROP INDEX url`).then(() => {
            })
        }
    } catch (error) {
        if (databaseConfig.dialect == "mysql") {
            console.log("Failed alter medias drop index url, medias not exist yet")
        }
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
        model: Media
    }

    model.addScope('withMedia', {
        include: [includeMedia]
    })

    model.options.defaultScope = model.options.defaultScope || {};
    model.options.defaultScope.method = model.options.defaultScope.method || [];
    model.options.defaultScope.include = model.options.defaultScope.include || []

    model.options.defaultScope.include.push(includeMedia)


    model.prototype.getMedia = function () {
        return getMedia(this)
    }
    model.prototype.getMediaByName = function (name) {
        let _medias = getMedia(this)
        if (!_medias || !name)
            return 

        for (let m of _medias) {
            if (m.name === name) {
                return m
            }
        }
        return 
    }

    model.prototype.getFirstMedia = function () {
        let _medias = getMedia(this)
        if (!_medias)
            return

        return _medias[0] || null
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

        if (!this.Media)
            return

        let _medias = await this.getMedia()

        for (let i = 0; i < _medias.length; i++) {
            if (_medias[i].name === name) {
                await Media.destroy({
                    where: {
                        name: name,
                        mediatable_id: this.id,
                        mediatable_type: this.constructor.name
                    }
                })
                try {
                    if (_medias[i].local_storage) {
                        await fse.remove(_medias[i].path)
                    }
                } catch (error) {
                    console.log("error", error)
                }
                this.Media.splice(i, 1)
                break
            }
        }
    }


    model.beforeBulkDestroy(async (instance) => {

        let _models = await model.findAll({
            where: instance.where
        })
        if (_models && _models.length > 0) {
            for (let _model of _models) {
                Media.destroy({
                    where: {
                        mediatable_id: _model.id,
                        mediatable_type: instance.model.options.name.singular
                    }
                })
                let _pathlocalStorage = getPathLocalStorage(_model.getMedia()) // result storage/user-1
                if (_pathlocalStorage) {
                    try {
                        fse.remove(_pathlocalStorage)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }

    })


}


/**
 * return list of dataValues of models
 * @param {*} _model any model that has binded with media model
 * @returns 
 */
const getMedia = (_model) => {
    if (!_model.Media) // from include default scope
        return

    let _medias = []
    let _media = {}
    for (let m of _model.Media) {
        _media = {}
        for (let key in m.dataValues) {
            _media[key] = m.dataValues[key]
        }
        if (_media.local_storage) {
            _media["path"] = _media["url"]
            _media["url"] = normalizeLocalStorageToUrl(_media["url"])
        }
        _medias.push(_media)
    }
    return _medias
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

        // moving from temporary dir
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
            // remove old media file
            try {
                if (media.local_storage) {
                    await fse.remove(media.url)
                }
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


/**
 * get path local storage if on there is a media stored on local storage
 * @param {*} medias 
 * @returns 
 */
const getPathLocalStorage = (medias) => {
    if (!medias || !Array.isArray(medias))
        return
    try {
        for (let m of medias) {
            if (m.local_storage) {
                // console.log("m.path:", m.path)
                const parts = m.path.split(path.sep)
                return parts.slice(0, 2).join('/');
            }
        }
    } catch (error) {
        console.log(error)
    }
    return
}

// ------------------------------------------------------------------------------------------- 

export default Media
export { hasMedia, loadMedia, getPathLocalStorage }
