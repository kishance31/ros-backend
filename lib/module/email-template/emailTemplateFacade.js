const emailTemplateService = require('./emailTemplateService');


function emailTemplateAdd(data, userId) {
    return emailTemplateService.emailTemplateAdd(data, userId).then(result => result)
    
}

function emailTemplateDeleteById(data) {
    return emailTemplateService.deleteEmailTemplate(data).then(data=> data)
      
}

function getEmailTemplateList(req) {
    return emailTemplateService.emailTemplateList(req).then(result =>result)
}


function getEmailTemplateById(req) {
    return emailTemplateService.getEmailTemplateById(req).then(result => result)
}

function updateEmailTemplateById(req,updateData) {
    return emailTemplateService.emailTemplateEditById(req,updateData).then(result => 
        result)
}

module.exports = {
    emailTemplateAdd,
    emailTemplateDeleteById,
    getEmailTemplateList,
    getEmailTemplateById,
    updateEmailTemplateById
}