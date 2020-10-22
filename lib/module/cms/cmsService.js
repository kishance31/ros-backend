'use strict';


const cmsDao = require('./cmsDao');
const cmsMapper = require('./cmsMapper');
const cmsConstants = require("./cmsConstants");
const { streamUploadToCloudinary } = require('../../appUtils');



async function updateAboutUs(aboutUsData, image) {
    // let exist = await cmsDao.checkExist();
    // let id = exist[0]._id

    if(typeof image === "object") {
        aboutUsData.aboutUsImage = await streamUploadToCloudinary(image.data);
    } else {
        aboutUsData.aboutUsImage = image;
    }
    return cmsDao.addAboutUs(aboutUsData).then((data) => {
        return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_Update, data)
    }).catch((err) => {
        console.log(err)
        return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    })

    // if (exist.length > 0) {
    //     return cmsDao.updateAboutUs(exist[0]._id, aboutUsData).then((data) => {
    //         return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_Update, data)
    //     }).catch((err) => {
    //         return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    //     })
    // } else {
    //     let aboutUsPic = image
    //     if (aboutUsPic) {
    //         aboutUsData.aboutUsImage = await streamUploadToCloudinary(aboutUsPic.data);
    //         return cmsDao.addAboutUs(aboutUsData).then((data) => {
    //             return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.AboutUs_Added, data)
    //         }).catch((err) => {
    //             logger.warn(err);
    //             if (err.message.indexOf("duplicate") !== -1) {
    //                 return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.CmsNameDuplicate)
    //             }
    //             return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, err.message)
    //         })
    //     }
    // }

}

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

//contact-us below

async function updateContactUs(contactUsData) {
    try {

        return cmsDao.saveContactUs(contactUsData).then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Update, data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })

        // let exist = await cmsDao.checkContactExist();
        // if (exist.length > 0) {

        //     return cmsDao.updateContactUs(exist[0]._id, contactUsData).then((data) => {
        //         return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Update, data)

        //     }).catch((err) => {
        //         return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)


        //     })
        // } else {
        //     return cmsDao.saveContactUs(contactUsData).then((data) => {
        //         return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Added, data)
        //     }).catch((err) => {
        //         logger.warn(err);
        //         if (err.message.indexOf("duplicate") !== -1) {
        //             return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.CmsNameDuplicate)
        //         }
        //         return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, err.message)
        //     })
        // }
    } catch (err) {
        return err;
    }
}

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
module.exports = {
    updateAboutUs,
    aboutUsList,
    updateContactUs,
    contactUsList
};