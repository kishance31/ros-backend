'use strict';


const emailTemplateDao = require('./emailTemplateDao');
const emailTemplateMapper = require('./emailTemplateMapper');
const emailTemplateConstants = require("./emailTemplateConstants");

async function emailTemplateAdd(emailTemplateData, adminId) {
    try {

        const adminExists = await emailTemplateDao.checkAdmin(adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(emailTemplateConstants.CODE.Unauthorized, emailTemplateConstants.MESSAGES.Unauthorized);
        }
        
        return emailTemplateDao.saveEmailTemplate(emailTemplateData).then((data) => {
            return emailTemplateMapper.responseMappingData(emailTemplateConstants.CODE.Success, emailTemplateConstants.MESSAGES.EmailTemplate_Added, data)
        }).catch((err) => {
            logger.warn(err);
            if(err.message.indexOf("duplicate") !== -1) {
                return emailTemplateMapper.responseMapping(emailTemplateConstants.CODE.INTRNLSRVR, emailTemplateConstants.MESSAGES.EmailTemplateNameDuplicate)    
            }
            return emailTemplateMapper.responseMapping(emailTemplateConstants.CODE.INTRNLSRVR, err.message)
        })
    } catch (err) {
        console.log(err)
        return err;
    }
};

function emailTemplateList(...args) {
    try {
        return emailTemplateDao.emailTemplateList(...args).then((data) => {
            return emailTemplateMapper.responseMappingList(emailTemplateConstants.CODE.Success, emailTemplateConstants.MESSAGES.EmailTemplate_Listed, data)
        }).catch((err) => {
            console.log({ err })
            return emailTemplateMapper.responseMapping(emailTemplateConstants.CODE.INTRNLSRVR, emailTemplateConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}

function getEmailTemplateById(id) {
    try {
        return emailTemplateDao.emailTemplateById(id).then((data) => {
            return emailTemplateMapper.responseMappingData(emailTemplateConstants.CODE.Success, emailTemplateConstants.MESSAGES.EmailTemplate_By_Id, data)

        }).catch((err) => {
            return emailTemplateMapper.responseMapping(emailTemplateConstants.CODE.INTRNLSRVR, emailTemplateConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}


function emailTemplateEditById(id, data) {
    try {
        return  emailTemplateDao.updateEmailTemplate(id, data).then((data) => {
            return emailTemplateMapper.responseMappingData(emailTemplateConstants.CODE.Success, emailTemplateConstants.MESSAGES.EmailTemplate_Update, data)

        }).catch((err)=>{
            return emailTemplateMapper.responseMapping(emailTemplateConstants.CODE.INTRNLSRVR, emailTemplateConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteEmailTemplate(id) {
    try {
        return emailTemplateDao.deleteEmailTemplate(id).then((data) => {
            return emailTemplateMapper.responseMapping(emailTemplateConstants.CODE.Success, emailTemplateConstants.MESSAGES.EmailTemplate_Deleted)

        }).catch((err)=>{
            return emailTemplateMapper.responseMapping(emailTemplateConstants.CODE.INTRNLSRVR, emailTemplateConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

module.exports = {
    emailTemplateAdd,
    emailTemplateList,
    getEmailTemplateById,
    emailTemplateEditById,
    deleteEmailTemplate
};