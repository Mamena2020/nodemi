let useLocale = false
if (process.env.LOCALE_USE === "true" || process.env.LOCALE_USE === true)
    useLocale = true

const locales = Object.freeze({
    en: "en",
    id: "id",
    es: "es",
    hi: "hi",
    ru: "ru",
    pt: "pt",
    zh: "zh",
    ja: "ja"
})

const localeConfig = {
    defaultLocale: locales.en,
    useLocale: useLocale,
    locales: locales
}

export default localeConfig