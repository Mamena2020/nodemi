import User from "../models/User.js";
import UserDetail from "../models/UserDetail.js";
import { authUser } from "../core/middleware/AuthJwt.js";
import RequestValidation from "../core/validation/RequestValidation.js";


const getUser = async (req, res) => {

    try {
        console.log("get user")
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401)
        const user = await User.findOne(
            {
                where: {
                    refresh_token: refreshToken
                },
                attributes: ['id', 'name', 'email'],
                include: {
                    model: UserDetail,
                    as: 'user_details',
                    attributes: ['bio']
                }
            }
        )

        if (!user) return res.sendStatus(404)

        let newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            detail: user.user_details,
            url: user.firstMediaUrl,
        }

        console.log("user.role", user.role)
        console.log("user.permissions", user.role.permissions)

        res.json({ message: "get success", "user": newUser })

    } catch (error) {
        console.log(error)
    }
}

class UploadRequest extends RequestValidation {

    constructor(req) {
        super(req).load(this)
    }

    data = ["a", "b", "c"]

    rules() {
        return {
            "file": {
                "validation": [
                    "required",
                    "image",
                    // "mimetypes:image/jpeg,image/png",
                    // "mimes:png,jpg",
                    "maxfile:1000,KB",
                ]
            },
            "hari_ini": {
                "validation": ["required", "date", "date_before_or_equal:now"]
            },
            "besok": {
                "validation": ["required", "date", "date_after:hari_ini"]
            },
            "npm": {
                "validation": ["required", "digit:12"],
            },
            "status": {
                "validation": ["required", "bolean"]
            },
            "pilih": {
                "validation": ["required", "not_in_array:" + this.data.join(",")]
            }
        };
    }
}


const upload = async (req, res) => {
    // console.log(req.body['files[]'])
    // console.log(req.body['file'])

    let valid = new UploadRequest(req)
    await valid.check()
    if (valid.isError())
        return res.json(valid.errors).status(402)


    console.log(req.body)

    if (!req.body['file'])
        return res.status(400).json({ message: "file not found" })

    const user = await authUser(req)
    if (!user)
        return res.status(403).json({ message: "need auth" })

    await user.saveMedia(
        req.body['file'],
        "avatar"
    )

    res.status(200).json("upload successfuly")
}


export default {
    getUser,
    upload,
}