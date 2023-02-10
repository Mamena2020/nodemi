import LocalePass from "../core/middleware/localePass.js";

export default function web(app) {
    app.get("/:locale",LocalePass, (req, res) => {

        let list = []
        app._router.stack.forEach(r => {
            if (r.route) {
                list.push(r.route.path)
            }
        });
        res.json({ "lists": list })
    })
    app.get("/:locale/test", LocalePass, (req, res) => {

        let list = []
        app._router.stack.forEach(r => {
            if (r.route) {
                list.push(r.route.path)
            }
        });
        res.json({ "list": list })
    })

}

