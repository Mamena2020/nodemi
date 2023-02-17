import localeConfig from "../config/Locale.js"

/**
 * checking locale code
 * @param {*} locale 
 * @returns bolean
 */
const isLocale = (locale) => {
    if (localeConfig.locales.includes(locale))
        return true

    return false
}

export default isLocale

