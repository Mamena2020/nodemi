import localeConfig from "../config/Locale.js"

class Locale {

    /**
     * checking locale code
     * @param {*} locale 
     * @returns bolean
     */
    static isLocale = (locale) => {
        if (Object.values(localeConfig.locales).includes(locale))
            return true

        return false
    }

    /**
     * create rule base on locale
     * @param {*} param0 
     * @returns 
     */
    static createRule({ key = "", rules = [] }) {
        var req = {}
        Object.values(localeConfig.locales).forEach(e => {
            req[key + "_" + e] = {}
            req[key + "_" + e]["rules"] = rules
        });
        return req
    }

    /**
     * create field base on data format like data { name_en :"data", name_id:"data"} to  {en:"data",id:"data"}
     * @param {*} param0 
     */
    static createField({ key = "", data = {}  }) {
        var fields = {}
        for (var locale in localeConfig.locales) {
            for (var d in data) {
                var splitData = d.split("_");
                var lastChar = splitData.pop();
                var prefix = splitData.join("_");
                if (prefix === key && lastChar === locale) {
                    fields[locale] = data[d]
                }
            }
        }
        return fields;
    }



}

export default Locale

