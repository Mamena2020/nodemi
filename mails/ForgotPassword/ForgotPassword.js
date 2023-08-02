import Mail from "../../core/mail/Mail.js"


class ForgotPassword extends Mail {
    constructor(from = '', to = [], subject = '', resetToken = '') {
        super().load({
            from: from,
            to: to,
            subject: subject,
            text: "You received this email because you requested to reset your password.",
            // attachments: [
            //     {
            //         filename: "theFile.txt",
            //         path: "mails/forgotPassword/examplefile.txt"
            //     },
            // ],
            html: {
                path: "mails/ForgotPassword/template.ejs",
                data: {
                    title: "Password Reset Request",
                    message: "You received this email because you requested to reset your password.",
                    reset_password_url: process.env.APP_URL + "/api/reset-password/" + resetToken,
                }
            },
        })
    }
}

export default ForgotPassword
    
    