import Mail from "../../core/mail/Mail.js"


class AccountVerify extends Mail {
    constructor(from = '', to = [], subject = '', token = '') {
        super().load({
            from: from,
            to: to,
            subject: subject,
            text: "Just need to verify that this is your email address.",
            // attachments: [
            //     {
            //         filename: "theFile.txt",
            //         path: "mails/AccountVerify/examplefile.txt"
            //     },
            // ],
            html: {
                path: "mails/AccountVerify/template.ejs",
                data: {
                    title: "Welcome to the party!",
                    message: "Just need to verify that this is your email address.",
                    verification_url: process.env.APP_URL + "/api/email-verification/" + token,
                }
            },
        })
    }
}

export default AccountVerify

