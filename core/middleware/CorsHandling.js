import cors from 'cors'
import corsConfig from "../config/Cors.js"

const CorsHandling = (app) => {
    app.use(cors(corsConfig))
}

export default CorsHandling