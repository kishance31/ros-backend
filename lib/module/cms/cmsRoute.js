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
cmsRouter.route('/createAboutUs').post([validators.validateAboutUs,authMiddleware.autntctAdminTkn],(req, res) => {
   

    let aboutUsObj =req.body
    if(req.files){
        if(req.files.aboutUsImage){
            aboutUsObj.files = req.files.aboutUsImage
        }
    }
    cmsFacade.addAboutUs(aboutUsObj, req.tokenPayload.userId)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateCms
cmsRouter.route('/getAboutUsList').get([authMiddleware.autntctAdminTkn],(req, res) => {
   
    cmsFacade.getAboutUsList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

cmsRouter.route('/getAboutUsById/:id').get([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.getAboutUsById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/updateAboutUs/:id').put([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.updateAboutUs(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/deleteAboutUs/:id').delete([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.deleteAboutUs(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

/**
 * contact us section  starts from here
 */
cmsRouter.route('/createContactUs').post([validators.validateContactUs,authMiddleware.autntctAdminTkn],(req, res) => {
    cmsFacade.addContactUs(req.body, req.tokenPayload.userId)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateCms
cmsRouter.route('/getContactUsList').get([authMiddleware.autntctAdminTkn],(req, res) => {
   
    cmsFacade.getContactUsList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

cmsRouter.route('/getContactUsById/:id').get([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.getContactUsById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/updateContactUs/:id').put([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.updateContactUs(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/deleteContactUs/:id').delete([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.deleteContactUs(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
module.exports = cmsRouter;