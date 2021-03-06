const cmsRouter = require('express').Router();
const cmsFacade = require('./cmsFacade');
const constants = require('../../constants');
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('../../commonHandler/responseHandler');
const validators = require('./cmsValidator')
// let fileUpload = require('express-fileupload');
// cmsRouter.use(fileUpload({
//     useTempFiles: true
// }));
//validators.validateAboutUs,

cmsRouter.route('/updateAboutUs/:id?').put([authMiddleware.autntctAdminTkn], (req, res) => {
    // const data = {
    //     _id: req.params.id 
    // };
    let aboutUsImage = null;
    if (req.files && req.files.aboutUsImage) {
        aboutUsImage = req.files.aboutUsImage
    }
    if (req.body.aboutUsImage) {
        aboutUsImage = req.body.aboutUsImage
    }
    cmsFacade.updateAboutUs({ description: req.body.description }, aboutUsImage)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/getAboutUsList').get((req, res) => {

    cmsFacade.getAboutUsList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

/**
 * contact us section  starts from here
 */

cmsRouter.route('/updateContactUs/:id?').put([authMiddleware.autntctAdminTkn], (req, res) => {
    // const data = {
    //     _id: req.params.id
    // };
    cmsFacade.updateContactUs(req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/getContactUsList').get((req, res) => {

    cmsFacade.getContactUsList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

cmsRouter.route('/saveContactUsQuery').post([validators.validateContactUsQuery], (req, res) => {
    cmsFacade.saveContactUsQuery(req.contactUsDetails)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/getContactUsQuery/:batch?/:limit?').get([validators.validatePagination], (req, res) => {
    let { batch, limit } = req.pagination;
    cmsFacade.getContactUsQuery(batch, limit)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/updateContactUsQuery/:id').post([], (req, res) => {
    let { id } = req.params;
    let {
        repliedMessage
    } = req.body
    cmsFacade.updateContactUsQuery(id, { repliedMessage, isReplied: true })
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/saveFAQS').post([validators.validateFAQ], (req, res) => {
    cmsFacade.saveFAQS(req.faqDetails)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/getFAQS').get((req, res) => {
    // let { batch, limit } = req.pagination;
    cmsFacade.getFAQS()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/updateFAQS/:id').post([validators.validateFAQ], (req, res) => {
    let { id } = req.params;
    cmsFacade.updateFAQS(id, req.faqDetails)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/deleteFAQS/:id').post((req, res) => {
    let { id } = req.params;
    cmsFacade.deleteFAQS(id)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/saveNewsLetter').post([validators.validateNewsLetter], (req, res) => {
    cmsFacade.saveNewsLetter(req.newsLetterDetails)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/getNewsLetter/:batch?/:limit?').get([validators.validatePagination], (req, res) => {
    let { batch, limit } = req.pagination;
    cmsFacade.getNewsLetter(batch, limit)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

// cmsRouter.route('/updateNewsLetter/:id').post([validators.validateNewsLetter], (req, res) => {
//     let { id } = req.params;
//     cmsFacade.updateFAQS(id, req.faqDetails)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);
//         });
// })

cmsRouter.route('/saveSocialMediaLinks').put([validators.validateSocialMediaLinks], (req, res) => {
    cmsFacade.socialMediaLinks(req.socialLinkData)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/getSocialMediaLinks').get([], (req, res) => {
    cmsFacade.getSocialMediaLinks()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

module.exports = cmsRouter;