
import cors from 'cors'

export default (app) => {
    app.use(cors({
        credentials: true,
        origin: ['http:localhost:3000']
    }))

    app.use(cors())
}