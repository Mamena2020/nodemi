export default function routers(app) {
    app.get("/apis", (req, res) => {
        let list = []
        app._router.stack.forEach(r => {
            if (r.route) {
                list.push(r.route.path)
            }
        });
        res.json(list)
    })
}

