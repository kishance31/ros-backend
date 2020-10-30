const emailTemplateRouter = require('express').Router();
const emailTemplateFacade = require('./emailTemplateFacade');
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('../../commonHandler/responseHandler');
const validators = require('./emailTemplateValidators')
let fileUpload = require('express-fileupload');
emailTemplateRouter.use(fileUpload({
    useTempFiles: true
}));
//validators.validateEmailTemplate,
emailTemplateRouter.route('/saveEmailTemplate').post([validators.validateEmailTemplate, authMiddleware.autntctAdminTkn], (req, res) => {
    emailTemplateFacade.emailTemplateAdd(req.body, req.tokenPayload.userId)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateEmailTemplate
emailTemplateRouter.route('/getEmailTemplateList/:batch?/:limit?').get([authMiddleware.autntctAdminTkn, validators.validatePagination], (req, res) => {
    const { batch, limit } = req.pagination;
    emailTemplateFacade.getEmailTemplateList(batch, limit)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

emailTemplateRouter.route('/getEmailTemplateById/:id').get([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.id
    };
    emailTemplateFacade.getEmailTemplateById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

emailTemplateRouter.route('/updateEmailTemplate/:id').put([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.id
    };
    emailTemplateFacade.updateEmailTemplateById(data, req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

emailTemplateRouter.route('/updateEmailTemplateStatus/:id').post([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.id
    };
    emailTemplateFacade.updateEmailTemplateById(data, { isActive: req.body.isActive })
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

emailTemplateRouter.route('/deleteEmailTemplate/:id').delete([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.id
    };
    emailTemplateFacade.emailTemplateDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})


module.exports = emailTemplateRouter;