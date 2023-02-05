export default function web(app) {
    app.get("/apis", (req, res) => {
        let list = []
        app._router.stack.forEach(r => {
            if (r.route) {
                list.push(r.route.path)
            }
        });
        res.json({"hasdasd":"Asdasd"})
    })
}

