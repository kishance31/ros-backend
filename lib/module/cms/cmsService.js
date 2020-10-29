'use strict';


const cmsDao = require('./cmsDao');
const cmsMapper = require('./cmsMapper');
const cmsConstants = require("./cmsConstants");
const { streamUploadToCloudinary } = require('../../appUtils');
const mailHandler = require('../../commonHandler/mailHandler');


async function updateAboutUs(aboutUsData, image) {
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
    } catch (err) {
        return err;
    }
}

function contactUsList() {
    try {
        return cmsDao.contactUsList().then((data) => {
            return cmsMapper.responseMappingData(cmsConstants.CODE.Success, cmsConstants.MESSAGES.ContactUs_Listed, data)
        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}

async function saveContactUsQuery(contactUsData) {
    try {
        return cmsDao.saveContactUsQuery(contactUsData).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, "SUCCESS")

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    }
}

async function getContactUsQuery(...args) {
    try {
        return cmsDao.getContactUsQuery(...args).then((data) => {
            return cmsMapper.responseMappingList(cmsConstants.CODE.Success, "SUCCESS", data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    }
}

async function updateContactUsQuery(id, contactUsData) {
    try {
        return cmsDao.updateContactUsQuery(id, contactUsData).then((data) => {
            let Intro = `Thank you for reaching to us. <br/><p>${data.repliedMessage}</p>` 
			const html = mailHandler.mailGenHTML({
				name: data.fullName,
				intro: Intro
			});

			// send mail
			mailHandler.sendMail({
				to: data.email,
				subject: "Contact us query",
				html
			});
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, "SUCCESS")
        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}

async function saveFAQS(faqData) {
    try {
        return cmsDao.saveFAQS(faqData).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, "SUCCESS")
        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    }
}

async function getFAQS(...args) {
    try {
        return cmsDao.getFAQS(...args).then((data) => {
            return cmsMapper.responseMappingList(cmsConstants.CODE.Success, "SUCCESS", data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    }
}

async function updateFAQS(id, faqData) {
    try {
        return cmsDao.updateFAQS(id, faqData).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, "SUCCESS")
        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}

async function deleteFAQS(id) {
    try {
        return cmsDao.deleteFAQS(id).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, "SUCCESS")
        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}

async function saveNewsLetter(...args) {
    try {
        return cmsDao.saveNewsLetter(...args).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, "SUCCESS")
        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    }
}

async function getNewsLetter(...args) {
    try {
        return cmsDao.getNewsLetter(...args).then((data) => {
            return cmsMapper.responseMappingList(cmsConstants.CODE.Success, "SUCCESS", data)

        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
    }
}

async function updateNewsLetter(id, dataObj) {
    try {
        return cmsDao.updateNewsLetter(id, dataObj).then((data) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.Success, "SUCCESS")
        }).catch((err) => {
            return cmsMapper.responseMapping(cmsConstants.CODE.INTRNLSRVR, cmsConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}

module.exports = {
    updateAboutUs,
    aboutUsList,
    updateContactUs,
    contactUsList,
    saveContactUsQuery,
    getContactUsQuery,
    updateContactUsQuery,
    saveFAQS,
    getFAQS,
    updateFAQS,
    deleteFAQS,
    saveNewsLetter,
    updateNewsLetter,
    getNewsLetter,
};