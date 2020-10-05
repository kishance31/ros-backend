const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
const {cfg} = require('../config');
 
// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'ROS Admin Management',
        link: 'http://localhost:3000/'
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

sgMail.setApiKey(cfg.API_SECRET);

exports.sendMail = ({to, subject, html}) => {
    let mail = {
        from: cfg.FROM_EMAIL,
        to,
        subject,
        html
    }

    sgMail.send(mail);
}