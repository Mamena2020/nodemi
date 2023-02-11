
import cors from 'cors'
import corsConfig from '../config/cors.js'

export default (app) => {
    app.use(cors(corsConfig))
}