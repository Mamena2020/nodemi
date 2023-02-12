import isLocale from "../locale/Locale.js"



const LocalePass = async (req, res, next) => {

    const prefixs = req.path.split('/'); // prefixs=> [ '', 'api', 'id','endpoint' ]
    let locale = ''
    if (prefixs[1] === 'api') {
        locale = prefixs[2] || '';
    } else {
        locale = prefixs[1] || ''
    }
    
    if (!isLocale(locale)) {
        return res.status(400).json({ "message": "Required valid locale code. Example: https://abc.com/api/en/endpoint or https://abc.com/en/endpoint" })
    }

    req["locale"] = locale
    next()
}

export default LocalePass