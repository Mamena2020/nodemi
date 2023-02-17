const Dictionary = Object.freeze({
    "success": {
        "en": "success",
        "id": "sukses",
    },
    "failed": {
        "en": "failed",
        "id": "gagal",
    },
    "error": {
        "en": "error",
        "id": "kesalahan",
    },
    "now": {
        "en": "now",
        "id": "sekarang",
    },
    "yesterday": {
        "en": "yesterday",
        "id": "kemarin",
    },
    "tomorrow": {
        "en": "tomorrow",
        "id": "besok",
    }

})

/**
 * Translate language to locale base on Dictionary
 * @param {*} key 
 * @param {*} locale 
 * @returns 
 */
const Translate = (key, locale) => {
    return Dictionary[key] && Dictionary[key][locale] || key
}

export default Translate
export { Dictionary }