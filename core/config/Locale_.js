let useLocale = false
if (process.env.LOCALE_USE === "true" || process.env.LOCALE_USE === true)
    useLocale = true

const localeConfig = {
    defaultLocale: "en",
    useLocale: useLocale,
    locales: ["en", "id"]
}

export default localeConfig