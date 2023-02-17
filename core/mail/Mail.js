import mailConfig from "../config/Mail.js";
import nodemailer from "nodemailer"
import ejs from "ejs"

/**
 * Store testing account
 */
var testingAccount
const mailAccount = async () => {
    if (mailConfig.testing) {
        if (!testingAccount) {
            testingAccount = await nodemailer.createTestAccount()
        }
        return {
            user: testingAccount.user,// generated ethereal user
            pass: testingAccount.pass // generated ethereal password
        }
    }
    return {
        user: mailConfig.username,
        pass: mailConfig.password
    }
}

/**
 * create transporter for email
 * @returns 
 */
const transporter = async () => {
    const mailAuth = await mailAccount()
    if (!mailAuth.user || !mailAuth.pass) {
        console.log("\x1b[31m", 'Mail credential invalid, Check your credential mail username or password', "\x1b[0m");
        throw 'Credential invalid'
    }
    const transport = {
        host: mailConfig.host || "smtp.ethereal.email",
        port: mailConfig.port || 587,
        secure: mailConfig.port == 465 ? true : false, // true for 465, false for other ports
        auth: mailAuth
    }
    return nodemailer.createTransport(transport);
}

class Mail {

    /**
     * Load message options
     * @param {*} param0 
     */
    async load({
        // ------------------- common fields
        from = '',
        to = [],
        subject = '',
        text = '',
        html = {
            path: '',
            data: {}
        },
        attachments = [],
        cc = [],
        bcc = [],
        // ------------------- advance fields
        sender = '',
        replyTo = [],
        alternatives = [],
        encoding = '',
        // ------------------- 
    }
    ) {
        if (!from)
            throw 'from email address is required'
        if (!Array.isArray(to) || to.length === 0)
            throw 'receivers is required and must be an array'
        if (!Array.isArray(attachments))
            throw 'attachments must be an array of object, see doc: https://nodemailer.com/message/attachments'
        if (!Array.isArray(cc) || !Array.isArray(bcc))
            throw 'cc & bcc must be an array email'
        if (!Array.isArray(alternatives))
            throw 'alternatives must be an array of object, see doc: https://nodemailer.com/message/alternatives'
        if (!Array.isArray(replyTo))
            throw 'replyTo must be an array of string'

        // ------------------- common fields
        this.from = from
        this.to = to
        this.subject = subject
        this.text = text
        this.attachments = attachments
        this.cc = cc
        this.bcc = bcc

        if (html && html.path) {
            this.html = await this.#renderHtml({ path: html.path.toString(), data: html.data })
        }
        // ------------------- advance fields
        this.sender = sender
        this.replyTo = replyTo
        this.encoding = encoding
        this.alternatives = alternatives
    }


    /**
     * rendering html to string with data if exist
     * @param {*} {path and data} 
     * @returns html string
     */
    async #renderHtml({ path = String, data }) {
        return await new Promise(async (resolve, reject) => {
            await ejs.renderFile(path, data || {}, (err, html) => {
                if (err) {
                    console.log("\x1b[31m", 'Error render html', err, "\x1b[0m");
                    reject(err)
                }
                resolve(html)
            });
        })
    }


    /**
     * preparing message options
     * @returns 
     */
    #messageOptions() {
        // ------------------- common fields
        let message = {}

        if (this.from) {
            message["from"] = this.from
        }
        if (this.to) {
            let _to = ''
            this.to.forEach((e, i) => {
                if (i > 0) {
                    _to = _to + ", " + e
                } else {
                    _to = _to + e
                }
            })
            message["to"] = _to
        }
        if (this.subject) {
            message["subject"] = this.subject
        }
        if (this.text) {
            message["text"] = this.text
        }
        if (this.attachments) {
            message["attachments"] = this.attachments
        }
        if (this.html) {
            message["html"] = this.html
        }

        if (this.cc) {
            let _cc = ''
            this.cc.forEach((e, i) => {
                if (i > 0) {
                    _cc = _cc + ", " + e
                } else {
                    _cc = _cc + e
                }
            })
            message['cc'] = _cc
        }

        if (this.bcc) {
            let _bcc = ''
            this.bcc.forEach((e, i) => {
                if (i > 0) {
                    _bcc = _bcc + ", " + e
                } else {
                    _bcc = _bcc + e
                }
            })
            message['bcc'] = _bcc
        }
        // ------------------- advance fields
        if (this.sender) {
            message['sender'] = this.sender
        }
        if (this.replyTo) {
            let _replyTo = ''
            this.replyTo.forEach((e, i) => {
                if (i > 0) {
                    _replyTo = _replyTo + ", " + e
                } else {
                    _replyTo = _replyTo + e
                }
            })
            message['replyTo'] = _replyTo
        }
        if (this.encoding) {
            message['encoding'] = this.encoding
        }
        if (this.alternatives) {
            message['alternatives'] = this.alternatives
        }

        return message
    }

    /**
     * sending mail
     * @returns 
     */
    async send() {
        const _transporter = await transporter()
        return await _transporter.sendMail(this.#messageOptions())
    }

}

export default Mail

