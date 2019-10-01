const nodemailer = require('nodemailer');
let sendMail = async (mailOptions, callback) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'baifeng1991321@gmail.com',
            pass: 'psvyvicbkoiknrkq'
        }
    });
    transporter.sendMail(mailOptions, callback);
}


module.exports = {
    sendMail: sendMail
}
