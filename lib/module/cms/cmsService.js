'use strict';


const cmsDao = require('./cmsDao');
const cmsMapper = require('./cmsMapper');
const cmsConstants = require("./cmsConstants");
const { streamUploadToCloudinary } = require('../../appUtils');

async function addAboutUs(aboutUsData, adminId) {
    try {
        
        const adminExists = await cmsDao.checkAdmin(adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(cmsConstants.CODE.Unauthorized, cmsConstants.MESSAGES.Unauthorized);
        }
        let aboutUsPic = aboutUsData.files;

        if (aboutUsPic) {
			aboutUsData.aboutUsImage = await streamUploadToCloudinary(aboutUsPic.data);
        return cmsDao.addAboutUs(aboutUsData).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_Added, data)
        }).catch((err) => {
            logger.warn(err);
            if(err.message.indexOf("duplicate") !== -1) {
                return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.CmsNameDuplicate)    
            }
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, err.message)
        })
    }
    } catch (err) {
        console.log(err)
        return err;
    }
};

function aboutUsList() {
    try {
        return cmsDao.aboutUsList().then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}



function getAboutUsById(id) {
    try {
        return cmsDao.aboutUsById(id).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_By_Id, data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}


function updateAboutUs(id, data) {
    try {
        return  cmsDao.updateAboutUs(id, data).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_Update, data)

        }).catch((err)=>{
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteAboutUs(id) {
    try {
        return cmsDao.deleteAboutUs(id).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_Deleted)

        }).catch((err)=>{
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}


//contact-us below

async function addContactUs(contactUsData, adminId) {
    try {

        const adminExists = await cmsDao.checkAdmin(adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(cmsConstants.CODE.Unauthorized, cmsConstants.MESSAGES.Unauthorized);
        }
        
        return cmsDao.saveContactUs(contactUsData).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Added, data)
        }).catch((err) => {
            logger.warn(err);
            if(err.message.indexOf("duplicate") !== -1) {
                return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.CmsNameDuplicate)    
            }
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, err.message)
        })
    } catch (err) {
        console.log(err)
        return err;
    }
};

function contactUsList() {
    try {
        return cmsDao.contactUsList().then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}



function getContactUsById(id) {
    try {
        return cmsDao.contactUsById(id).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_By_Id, data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}


function updateContactUs(id, data) {
    try {
        return  cmsDao.updateContactUs(id, data).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Update, data)

        }).catch((err)=>{
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteContactUs(id) {
    try {
        return cmsDao.deleteContactUs(id).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Deleted)

        }).catch((err)=>{
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
module.exports = {
    addAboutUs,
    aboutUsList,
    getAboutUsById,
    updateAboutUs,
    deleteAboutUs,
    addContactUs,
    contactUsList,
    getContactUsById,
    updateContactUs,
    deleteContactUs
};