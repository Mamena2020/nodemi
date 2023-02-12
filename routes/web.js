import LocalePass from "./../core/middleware/localePass.js";

export default function web(app) {
    app.get("/:locale", LocalePass, (req, res) => {
        res.json({ "message": "hellow" })
    })
}

