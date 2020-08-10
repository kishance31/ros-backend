const fs = require('fs');
const sendgridTransport = require('@sendgrid/mail');

module.exports = 

class Email {

    constructor(_api_secret_key) {
        sendgridTransport.setApiKey(_api_secret_key);
    }

    getHtmlDataFromPath(options) {
        return new Promise((resolve, reject) => {
            if (options.htmlTemplate)
                return resolve(options.htmlTemplate);
            if (!options.templateName)
                return resolve("test")
            fs.readFile(options.templateName, 'utf8', function (err, htmlEmail) {
                if (err) {
                    return console.log(err);
                }
                Object.keys(options.templateData).forEach(key => {
                    options.templateData['%' + key + '%'] = options.templateData[key];
                    delete options.templateData[key];
                })

                htmlEmail = htmlEmail.replace(/%\w+%/g, function (all) {
                    return options.templateData[all] || all;
                });
                resolve(htmlEmail)
            })
        })
    }

    async send(mailOptions) {
        mailOptions.html = await this.getHtmlDataFromPath(option);
        //    return this.provider.sendMail(option);
        return sendgridTransport.send(mailOptions);
    }
}
