const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
const {cfg} = require('../config');
 
// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'ROS Admin Management',
        link: `${cfg.clientUrl}`
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

exports.mailGenHTML = ({name, intro, action}) => {
    let mailBody = {
        body: {
            name,
            intro,
            action
        }
    }

    return mailGenerator.generate(mailBody);
}
let API_SECRET = "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"
sgMail.setApiKey(API_SECRET);

exports.sendMail = ({to, subject, html}) => {
    //cfg.FROM_EMAIL
    let mail = {
        from: "jeena.varghese@codezeros.com",
        to,
        subject,
        html
    }

    sgMail.send(mail);
}