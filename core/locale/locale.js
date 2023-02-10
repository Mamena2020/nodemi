import localeConfig from "../config/locale.js"

const isLocale = (locale) => {
    for (let key in localeConfig.locales) {
        if (localeConfig.locales[key] === locale)
            return true
    }
    return false
}

export default isLocale

