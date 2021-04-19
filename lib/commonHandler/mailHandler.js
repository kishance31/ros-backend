const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
const { cfg } = require('../config');
const EmailTemplateModel = require('../model/emailTemplateModel');
const nodemailer = require('nodemailer');

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

exports.mailGenHTML = ({ name, intro, action }) => {
    let mailBody = {
        body: {
            name,
            intro,
            action
        }
    }
    return mailGenerator.generate(mailBody);
}
// let API_SECRET = "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"
// sgMail.setApiKey(cfg.API_SECRET);

exports.sendMail = ({ to, subject, html }) => {
    // cfg.FROM_EMAIL
    // let mail = {
    //     from: cfg.FROM_EMAIL,
    //     to,
    //     subject,
    //     html
    // }
    // sgMail.send(mail);


    let EMAIL_CONFIG = {
        pool: true,
        host: cfg.smtp_host,
        port: cfg.smtp_port,
        secure: true,
        auth: {
            // type:'PLAIN',
            user: cfg.email_auth, // generated ethereal user
            pass: cfg.email_pswd // generated ethereal password
        }
    }
    let transporter = nodemailer.createTransport(EMAIL_CONFIG)

    return transporter.sendMail({
        from: cfg.email_auth,
        to,
        subject,
        html
    });
}

exports.getMailTemplate = async (title) => {
    return await EmailTemplateModel.findOne({ title }).exec();
}