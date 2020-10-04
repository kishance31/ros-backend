const cmsRouter = require('express').Router();
const cmsFacade = require('./cmsFacade');
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./cmsValidators')
let fileUpload = require('express-fileupload');
cmsRouter.use(fileUpload({
    useTempFiles: true
}));
//validators.validateCms,
cmsRouter.route('/saveCms').post([validators.validateCms,authMiddleware.autntctAdminTkn],(req, res) => {
    cmsFacade.cmsAdd(req.body, req.tokenPayload.userId)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateCms
cmsRouter.route('/getCmsList').get([authMiddleware.autntctAdminTkn],(req, res) => {
   
    cmsFacade.getCmsList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

cmsRouter.route('/getCmsById/:id').get([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.getCmsById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/updateCms/:id').put([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.updateCmsById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cmsRouter.route('/deleteCms/:id').delete([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cmsFacade.cmsDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})


module.exports = cmsRouter;