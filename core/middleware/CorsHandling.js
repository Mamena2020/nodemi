
import cors from 'cors'
import corsConfig from './../config/Cors.js'

export default (app) => {
    app.use(cors(corsConfig))
}