import localeConfig from "./../config/Locale.js"

const isLocale = (locale) => {
    if (localeConfig.locales.includes(locale))
        return true

    return false
}

export default isLocale

