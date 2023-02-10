import localeConfig from "../config/locale.js"

const isLocale = (locale) => {
    if (localeConfig.locales.includes(locale))
        return true

    return false
}

export default isLocale

