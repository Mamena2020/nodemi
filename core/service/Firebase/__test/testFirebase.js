import FirebaseService from "../FirebaseService.js";



class testFirebase {


    static fcm() {
        FirebaseService.sendMessage({
            body: "test body",
            title: " notif",
            data: {
                message: "this is message"
            },
            registrationTokens: ["asdasdasdsad"]

        })
    }

}

testFirebase.fcm()