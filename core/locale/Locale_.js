import localeConfig from "../config/Locale_.js"


const isLocale = (locale) => {
    if (localeConfig.locales.includes(locale))
        return true

    return false
}

export default isLocale

