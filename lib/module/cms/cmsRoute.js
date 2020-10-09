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

cmsRouter.route('/updateAboutUs/:id?').put([authMiddleware.autntctAdminTkn],(req, res) => {
    // const data = {
    //     _id: req.params.id 
    // };
    cmsFacade.updateAboutUs(req.body,req.files.aboutUsImage)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/getAboutUsList').get([authMiddleware.autntctAdminTkn],(req, res) => {
   
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

cmsRouter.route('/updateContactUs/:id?').put([authMiddleware.autntctAdminTkn],(req, res) => {
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

cmsRouter.route('/getContactUsList').get([authMiddleware.autntctAdminTkn],(req, res) => {
   
    cmsFacade.getContactUsList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

//home-page

// cmsRouter.route('/createHome').post([validators.validateAboutUs,authMiddleware.autntctAdminTkn],(req, res) => {
   

//     let homeObj =req.body
//     if(req.files){
//         if(req.files.image){
//             aboutUsObj.files = req.files.aboutUsImage
//         }
//     }
//     cmsFacade.addHome(homeObj, req.tokenPayload.userId)
//         .then((result) => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch((err) => {
//             logger.error(`ERROR `, err );
//             responseHandler.sendError(res, err);
//         });
// });

module.exports = cmsRouter;