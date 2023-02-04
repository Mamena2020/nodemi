import fse from 'fs-extra'
import path from "path";
import os from 'os'
import busboy from "busboy";


// the body - parser middleware is configured to handle application / json 
// and application / x - www - form - urlencoded content types.
// To handle form - data using middleware like multer or busboy


const isArray = (name) => {
    const a = name.indexOf("[")
    const b = name.indexOf("]")
    if (a !== -1 && b !== -1) {
        if (b - 1 === a || b - 2 === a) {
            return true
        }
    }
    return false
}

/**
 * start remove all temp files after response is send back to client
 * @param {*} res response of expres 
 * @param {*} files files
 */
const clearTempFiles = (res, files) => {
    res.on("finish", () => {
        try {
            for (let fieldName in files) {
                try {
                    if (fse.pathExistsSync(files[fieldName].tempDir))
                        fse.removeSync(files[fieldName].tempDir)
                } catch (error1) {
                    console.log(error1)
                }
            }
        } catch (error) {
            console.log(error)
        }
    })
}



const parseFields = (fieldName, value, req) => {

    // if (fieldName.endsWith('[]'))  // comment[]
    // {
    //     const key = fieldName.slice(0, -2);
    //     req.body[key] = req.body[key] || [];
    //     req.body[key].push(value);
    // } else if (/\[\d+\]\[\w+\]/.test(fieldName)) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]\[(\w+)\]/); // "name" or  [0] or [name]
    //     const key = match[1]; // name
    //     const index = match[2]; // [0]
    //     const subKey = match[3]; //[name]
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = req.body[key][index] || {};
    //     req.body[key][index][subKey] = value;
    // } else if (fieldName.endsWith(']')) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]/);
    //     const key = match[1];
    //     const index = match[2];
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = value;
    // } else {
    //     req.body[fieldName] = value;
    // }


    // if (fieldName.endsWith('[]')) {
    //     const key = fieldName.slice(0, -2);
    //     req.body[key] = req.body[key] || [];
    //     req.body[key].push(value);
    // } else if (/\[\d+\]\[\w+\]/.test(fieldName)) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
    //     const key = match[1];
    //     const index = match[2];
    //     const subKey = match[3];
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = req.body[key][index] || {};
    //     req.body[key][index][subKey] = value;
    // } else if (/\[\w+\]/.test(fieldName)) {
    //     const match = fieldName.match(/(\w+)\[(\w+)\]/);
    //     const key = match[1];
    //     const subKey = match[2];
    //     req.body[key] = req.body[key] || {};
    //     req.body[key][subKey] = value;
    // } else if (fieldName.endsWith(']')) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]/);
    //     const key = match[1];
    //     const index = match[2];
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = value;
    // } else {
    //     req.body[fieldName] = value;
    // }

    // if (fieldName.endsWith('[]')) {
    //     const key = fieldName.slice(0, -2);
    //     req.body[key] = req.body[key] || [];
    //     req.body[key].push(value);
    // } else if (/\[\d+\]\[\w+\]/.test(fieldName)) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
    //     const key = match[1];
    //     const index = match[2];
    //     const subKey = match[3];
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = req.body[key][index] || {};
    //     req.body[key][index][subKey] = value;
    // } else if (/\[\w+\]/.test(fieldName)) {
    //     const match = fieldName.match(/(\w+)\[(\w+)\]/);
    //     const key = match[1];
    //     const subKey = match[2];
    //     req.body[key] = req.body[key] || {};
    //     req.body[key][subKey] = value;
    // } else if (fieldName.endsWith(']')) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]/);
    //     const key = match[1];
    //     const index = match[2];
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = value;
    // } else {
    //     req.body[fieldName] = value;
    // }


    // if (fieldName.endsWith('[]')) {
    //     const key = fieldName.slice(0, -2);
    //     req.body[key] = req.body[key] || [];
    //     req.body[key].push(value);
    // } else if (/\[\d+\]\[\w+\]/.test(fieldName)) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
    //     const key = match[1];
    //     const index = match[2];
    //     const subKey = match[3];
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = req.body[key][index] || {};
    //     req.body[key][index][subKey] = value;
    //     parseFields(`${key}[${index}]`, req.body[key][index], req);
    // } else if (/\[\w+\]/.test(fieldName)) {
    //     const match = fieldName.match(/(\w+)\[(\w+)\]/);
    //     const key = match[1];
    //     const subKey = match[2];
    //     req.body[key] = req.body[key] || {};
    //     req.body[key][subKey] = value;
    //     parseFields(key, req.body[key], req);
    // } else if (fieldName.endsWith(']')) {
    //     const match = fieldName.match(/(\w+)\[(\d+)\]/);
    //     const key = match[1];
    //     const index = match[2];
    //     req.body[key] = req.body[key] || [];
    //     req.body[key][index] = value;
    //     parseFields(key, req.body[key], req);
    // } else {
    //     req.body[fieldName] = value;
    // }

    // const req = { body: {} };
    // for (const [fieldName, value] of Object.entries(req.fields)) {
    //     parseNestedInput(fieldName, value, req.body);
    // }
}


const parseNestedInput = (input, target = {}, prefix = '') => {
    Object.keys(input).forEach(key => {
        const value = input[key];
        const keys = prefix ? prefix.split('[') : [];

        if (keys.length === 1) {
            if (Array.isArray(value)) {
                target[key] = value;
            } else {
                target[key] = value;
            }
        } else if (keys.length === 2) {
            const index = keys[1].replace(']', '');
            target[keys[0]] = target[keys[0]] || [];
            target[keys[0]][index] = target[keys[0]][index] || {};
            parseNestedInput(value, target[keys[0]][index]);
        } else if (keys.length === 3) {
            const index = keys[1].replace(']', '');
            target[keys[0]] = target[keys[0]] || [];
            target[keys[0]][index] = target[keys[0]][index] || {};
            target[keys[0]][index][keys[2]] = value;
        }
    });

    return target;
}


/**
 * 
 * @param {*} arr  -> item 0 name
 * @param {*} index -> 0
 * @param {*} body -> item
 * @returns 
 */
const recursiveField = (arr, index, body) => {

    if (!arr)
        return

    if (index <= arr.length) {
        if (index == arr.length - 1) {

        }

        // if (!arr[index].hasBracket) {
        //     if(req.body[arr[index].name])
        //     {

        //     }
        //     else
        //     {
        //         req.body[arr[index].name]
        //     }
        // }

        if (!body[arr[index].name]) {
            body = {}
        }

        else
            if (Array.isArray(body)) {
                if (body.length == 0) {
                    body.push()
                }
            }

        if (/\d+/.test(arr[index].name)) {
            if (!Array.isArray(body)) {
                body = []
            }
        }
        else {
            if (Array.isArray(body)) {
                body.push()
            }

            body[arr[index].name] = body[arr[index].name] || {}
        }

        return recursiveField(arr, index + 1, body)
    }
    return
}

const parseFields2 = (fieldName, value, req) => {
    if (fieldName.endsWith('[]') && (fieldName.match(/\[/g) || []).length == 1)  // comment[]
    {
        const key = fieldName.slice(0, -2);
        req.body[key] = req.body[key] || [];
        req.body[key].push(value);
    }
    else
        if (fieldName.includes("[") && fieldName.includes("]")) {


            // seo[image][url]
            let arr = fieldName.split(/[\[\]]+/)
            let items = arr.map(function (item) {

                if (item.length > 0) {
                    // item-> seo | image |  url    
                    let firstIndex = fieldName.indexOf(item)
                    let lastIndex = firstIndex + item.length - 1
                    console.log("first/last index of " + item, { firstIndex, lastIndex })
                    let hasBracket = false
                    if (firstIndex > 0 && lastIndex < fieldName.length - 1) {
                        if (fieldName[firstIndex - 1] == "[" && fieldName[lastIndex + 1] == "]") {
                            hasBracket = true
                        }
                    }
                    return { name: item, hasBracket: hasBracket };
                }
            });

            console.log(items)
            // recursiveField(arr, 0, req.body)

            let body
            for (let i = 0; i < items.length; i++) {
                if (i == 0) {
                    req.body[items[i].name] = req.body[items[i].name] || {}
                    body = req.body[items[i].name]
                }
                if (i == items.length - 1) {
                    body = value
                }
                else {

                    if (/\w+/.test(items[i].name)) {
                        body[items[i].name] = body[items[i].name]
                    }
                }
            }




        }
        else {
            req.body[fieldName] = value
        }
}


/**
 * request handling for handling nested fields or file request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const mediaRequestHandling = async (req, res, next) => {

    if (req.method === 'POST'
        && req.headers['content-type'].startsWith('multipart/form-data') ||
        req.method === 'POST'
        && req.headers['content-type'].startsWith('application/x-www-form-urlencoded')) {

        var bb = busboy({ headers: req.headers })
        let tempFiles = {}

        bb.on('file', function (fieldName, file, info) {

            //ex: file[]
            if (isArray(fieldName)) {
                if (!req.body[fieldName]) {
                    req.body[fieldName] = []
                    tempFiles[fieldName] = []
                }
            }


            let tempDir = path.join(os.tmpdir(), info.filename ?? 'temp.temp');

            let fileSize = 0
            file.pipe(fse.createWriteStream(tempDir));

            file.on("data", (data) => {
                fileSize += data.length
            })
            file.on('end', function () {

                let newFile = {
                    name: info.filename,
                    encoding: info.encoding,
                    type: info.mimeType,
                    size: fileSize,
                    sizeUnit: 'bytes',
                    extension: path.extname(info.filename ?? 'temp.temp'),
                    tempDir: tempDir
                }

                if (isArray(fieldName) && Array.isArray(req.body[fieldName])) {
                    if (info.filename) {
                        req.body[fieldName].push(newFile)
                    }
                    tempFiles[fieldName].push(newFile)
                }
                else {
                    if (info.filename) {
                        req.body[fieldName] = newFile
                    }
                    tempFiles[fieldName] = newFile
                }
            })
        })

        bb.on('field', (fieldName, value) => {
            // parseFields(fieldName, value, req)
            // parseFields2(fieldName, value, req)
            // fields[fieldName] = value



            const keys = fieldName.split(/[\[\]]+/).filter(key => key);
            let current = req.body;

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if (key.endsWith(']')) {
                    key = key.slice(0, -1);
                }
                if (i === keys.length - 1) {
                    if (Array.isArray(current)) {
                        current.push(value);
                    } else if (typeof current[key] === 'string') {
                        current[key] = [current[key], value];
                    } else if (Array.isArray(current[key])) {
                        current[key].push(value);
                    } else {
                        current[key] = value;
                    }
                } else {
                    current[key] = current[key] || (isNaN(keys[i + 1]) ? {} : []);
                    current = current[key];
                }
            }



        })

        bb.on("finish", () => {
            // console.log(body)
            clearTempFiles(res, tempFiles)
            next()
        })
        req.pipe(bb);
    }
    else {
        next()
    }
}



export default mediaRequestHandling

