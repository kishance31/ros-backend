'use strict';


const cmsDao = require('./cmsDao');
const cmsMapper = require('./cmsMapper');
const cmsConstants = require("./cmsConstants");

async function cmsAdd(cmsData, adminId) {
    try {

        const adminExists = await cmsDao.checkAdmin(adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(cmsConstants.CODE.Unauthorized, cmsConstants.MESSAGES.Unauthorized);
        }
        
        return cmsDao.saveCms(cmsData).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_Added, data)
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

function cmsList() {
    try {
        return cmsDao.cmsList().then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}

function getCmsWithSubCms() {
    try {
        return cmsDao.getCmsWithSubCms().then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_Listed, data)
        }).catch((err) => {
            console.log({ err })
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}

function getCmsById(id) {
    try {
        return cmsDao.cmsById(id).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_By_Id, data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}


function cmsEditById(id, data) {
    try {
        return  cmsDao.updateCms(id, data).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_Update, data)

        }).catch((err)=>{
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function cmsStatusEditById(id, data) {
    try {
        return  cmsDao.updateCmsStatus(id, data).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_Update, data)

        }).catch((err)=>{
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function deleteCms(id) {
    try {
        return cmsDao.deleteCms(id).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_Deleted)

        }).catch((err)=>{
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function getCmsByCorporateId(id){
    try {
        return cmsDao.cmsByCorporateId(id).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.Cms_By_Corporate, data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }
}
module.exports = {
    cmsAdd,
    cmsList,
    getCmsById,
    cmsEditById,
    cmsStatusEditById,
    deleteCms,
    getCmsByCorporateId,
    getCmsWithSubCms
};