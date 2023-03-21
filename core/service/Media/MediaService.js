import { Model, DataTypes } from "sequelize";
import { v4 as uuid4 } from 'uuid'
import path from 'path'
import fse from 'fs-extra'
import db from "../../database/Database.js"
import mediaConfig, { mediaStorages } from "../../config/Media.js";
import FirebaseService from "../Firebase/FirebaseService.js";


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
    media_storage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    path: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
        // unique: true
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
    // // handling for multiple index of url
    // try {
    //     if (alter) {
    //         await db.query(`ALTER TABLE medias DROP INDEX url`).then(() => {
    //         })
    //     }
    // } catch (error) {
    //     if (databaseConfig.dialect == "mysql") {
    //         console.log("Failed alter medias drop index url, medias not exist yet")
    //     }
    // }
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
        scope: {
            mediatable_type: model.options.name.singular
        }
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


    /**
     * get media object by name
     * @param {*} name 
     * @returns array of media object 
     */
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
    /**
     * get single first media object
     * @returns media object
     */
    model.prototype.getFirstMedia = function () {
        let _medias = getMedia(this)
        if (!_medias)
            return

        return _medias[0] || null
    }

    /**
     * get array of media object with exception 
     * @param {*} except string or array if string
     * @returns array of media object 
     */
    model.prototype.getMediaExcept = function (except) {
        let _medias = getMedia(this)
        if (!_medias)
            return []

        const data = []

        if (typeof except === "string") {
            for (let media of _medias) {
                if (media.name != except) {
                    data.push(media)
                }
            }
        } else
            if (Array.isArray(except)) {
                for (let media of _medias) {
                    if (!except.includes(media.name)) {
                        data.push(media)
                    }
                }
            }
        return data
    }

    /**
     * get array of media url
     */
    model.prototype.getMediaUrl = function () {
        let _medias = getMedia(this)
        if (!_medias)
            return []

        const urls = []
        for (let media of _medias) {
            urls.push(media.url)
        }
        return urls
    }

    /**
     * get array of media url with exception
     */
    model.prototype.getMediaUrlExcept = function (except) {
        let _medias = this.getMediaExcept(except)
        if (!_medias)
            return []

        const urls = []
        for (let media of _medias) {
            urls.push(media.url)
        }
        return urls
    }



    /**
     * save media
     * @param {*} file  
     * @param {*} name 
     */
    model.prototype.saveMedia = async function (file, name) {
        return await saveMedia({
            model: this,
            file: file,
            name: name
        })
    }

    /**
     * destroy media
     * @param {*} name 
     * @returns 
     */
    model.prototype.destroyMedia = async function (name) {
        if (!name)
            throw "need media name"

        if (!this.Media)
            return false

        let _medias = await this.getMedia()
        let status = false;
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
                    if (_medias[i].media_storage === mediaStorages.local) {
                        await fse.remove(_medias[i].path)
                    }
                    if (_medias[i].media_storage === mediaStorages.firebase) {
                        await FirebaseService.deleteMedia(_medias[i].path)
                    }
                    status = true;
                } catch (error) {
                    console.log("error", error)
                }
                if (status) {
                    this.Media.splice(i, 1)
                    break
                }
            }
        }
        return status
    }


    model.beforeBulkDestroy(async (instance) => {

        let _models = await model.findAll({
            where: instance.where
        })
        if (_models && _models.length > 0) {
            for (let _model of _models) {
                let _medias = await _model.getMedia()
                Media.destroy({
                    where: {
                        mediatable_id: _model.id,
                        mediatable_type: instance.model.options.name.singular
                    }
                })
                let paths = getPathsFirebaseFromMedias(_medias)
                if (paths.length) {
                    FirebaseService.deleteMedias(paths)
                }

                let _pathlocalStorage = getPathLocalStorage(_medias) // result storage/user-1
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
        if (_media.media_storage === mediaStorages.local) {
            // _media["path"] = _media["url"]
            _media["url"] = normalizeLocalStorageToUrl(_media["url"])
        }
        _medias.push(_media)
    }
    return _medias
}


// ------------------------------------------------------------------------------------------- delete file


// ------------------------------------------------------------------------------------------- store file functions
/**
 * store media to local storage
 * @param {*} file 
 * @param {*} mediatable_type 
 * @param {*} mediatable_id 
 * @returns { path, url }
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
                console.log(err);
                return reject();
            }
            return resolve({ path: targetDir, url: targetDir })
        })
    })
}



/**
 * save a media 
 * @param { model = Model, file = Object, name = String } 
 * @returns media url
 */
const saveMedia = async ({ model = Model, file = Object, name = String }) => {
    if (!file || !file.extension || !name || !model) {
        console.log("Save media failed: require all params, Please check file or name")
        return
    }
    const mediatable_id = model.id
    const mediatable_type = model.constructor.options.name.singular


    var targetStorage
    if (mediaConfig.mediaStorage === mediaStorages.local) {
        targetStorage = await saveToLocal(file, mediatable_type, mediatable_id)
    }
    if (mediaConfig.mediaStorage === mediaStorages.firebase) {
        targetStorage = await FirebaseService.saveMedia(file)
    }


    if (targetStorage) {

        delete file.tempDir

        const media = await Media.findOne({
            where: {
                mediatable_id: mediatable_id,
                mediatable_type: mediatable_type,
                name: name
            }
        })
        if (!media) {
            // create new media
            await Media.create({
                mediatable_id: mediatable_id,
                mediatable_type: mediatable_type,
                url: targetStorage.url,
                path: targetStorage.path,
                info: JSON.stringify(file),
                name: name,
                media_storage: mediaConfig.mediaStorage
            })
        }
        else {
            // update media exists before with same name

            // remove old media file
            try {
                if (media.media_storage === mediaStorages.local) {
                    fse.remove(media.path)
                }
                if (media.media_storage === mediaStorages.firebase) {
                    FirebaseService.deleteMedia(media.path)
                }
            } catch (error) {
            }

            await media.update({
                url: targetStorage.url,
                path: targetStorage.path,
                info: JSON.stringify(file),
                media_storage: mediaConfig.mediaStorage
            })
        }
        if (mediaConfig.mediaStorage === mediaStorages.local) {
            return normalizeLocalStorageToUrl(targetStorage.url)
        }
        else {
            return targetStorage.url
        }
    }
    return null
}
// -------------------------------------------------------------------------------------------  helpers
/**
 * normalize media path to url
 * ex: path   => /storage/user-1/image.jpg
 *     result => http://localhost:8000/user-1/image.jpd
 * @param {*} filePath 
 * @returns url
 */

const normalizeLocalStorageToUrl = (filePath) => {
    let directories = filePath.split(path.sep)
    directories = directories.slice(1) // remove first path ->  /storage/
    let newPath = directories.join(path.sep)
    return mediaConfig.rootMediaUrl + newPath.replace(/\\/g, "/")
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
 * @returns ex: storage/user-1
 */
const getPathLocalStorage = (medias) => {
    if (!medias || !Array.isArray(medias))
        return
    try {
        for (let m of medias) {
            if (m.media_storage === mediaStorages.local) {
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

/**
 * get firebase paths from array of media object
 * @param {*} medias 
 * @returns 
 */
const getPathsFirebaseFromMedias = (medias) => {
    if (!medias || !Array.isArray(medias))
        return []

    let paths = []

    try {
        for (let m of medias) {
            if (m.media_storage === mediaStorages.firebase) {
                paths.push(m.path)
            }
        }
    } catch (error) {
        console.log(error)
    }

    return paths

}
// ------------------------------------------------------------------------------------------- 

export default Media
export { hasMedia, loadMedia, getPathLocalStorage }
