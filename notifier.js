let nodemailer = require('nodemailer');

let nodemailerTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: String(process.env.SENDER_EMAIL),
        pass: String(process.env.APPLICATION_PASSWORD)
    }
});


exports.sendEmail = function (senderEmail, receiverEmail, subjectLine, slotDetails, callback) {
    // console.log("Sending email", email, subjectLine, slotDetails)
    let options = {
        from: String('Vaccine Checker ' + senderEmail),
        to: receiverEmail,
        subject: subjectLine,
        text: 'Vaccine slot available. Details: \n\n' + slotDetails
    };
    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            console.log("Error in sending mail")
            console.log("Error in sending mail", error)
            return callback(error);
        }
        callback(error, info);
    });
};
