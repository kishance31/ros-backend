const licenseRouter = require('express').Router();
const licenseFacade = require('./licensesFacade');
const responseHandler = require('../../commonHandler/responseHandler');
const licenseValidators = require('./licensesValidators');
const authMiddleware = require('../../middlewares/auth');
const { result } = require('lodash');

//get all license list
licenseRouter.get('/licenseList', (req, res) => {
    licenseFacade.getLicenseList()
        .then(result =>
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });

});

//add a license
licenseRouter.post('/addLicense', [authMiddleware.autntctAdminTkn, licenseValidators.validateLicense], (req, res) => {
    const {
        type,
        price,
    } = req.body;
    licenseFacade.addLicense({ type, price })
        .then(result =>
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });
});

licenseRouter.get('/total/:corporateId', [licenseValidators.validateCorporateId, authMiddleware.autntctTkn], (req, res) => {
    const {
        params: {
            corporateId,
        },
        tokenPayload: {
            userId,
            role,
        }
    } = req;
    licenseFacade.getTotalLicenseCount({ corporateId, userId, role })
        .then(result =>
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });
});

licenseRouter.post('/decrement', [licenseValidators.validateCorporateId, authMiddleware.autntctTkn], (req, res) => {
    const {
        body: {
            corporateId,
            licenseType
        },
        tokenPayload: {
            userId,
            role,
        }
    } = req;
    logger.info(req.body)
    licenseFacade.decrementLicenseCount({ corporateId, licenseType, userId, role })
        .then(result =>
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });

});

// activate license
licenseRouter.post('/activate/:type',[authMiddleware.autntctAdminTkn, licenseValidators.validateLicenseType], (req, res) => {
    licenseFacade.activateLicense(req.params.type, req.tokenPayload.userId, req.tokenPayload.role)
        .then(result =>
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });

});

// activate license
licenseRouter.post('/deactivate/:type',[authMiddleware.autntctAdminTkn, licenseValidators.validateLicenseType], (req, res) => {
    licenseFacade.deactivateLicense(req.params.type, req.tokenPayload.userId, req.tokenPayload.role)
        .then(result =>
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });

});

//add a license
licenseRouter.post('/update', [authMiddleware.autntctAdminTkn, licenseValidators.validateLicense], (req, res) => {
    const {
        type,
        price,
        id
    } = req.body;
    licenseFacade.editLicense(id, { type, price }, req.tokenPayload)
        .then(result =>
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });
});

module.exports = licenseRouter;