"use strict";

const purchaseLicenseRouter = require('express').Router();
const purchaseLicenseValidator = require('./purchaseLicenseValidators');
const purchaseLicenseFacade = require('./purchaseLicenseFacade');
const responseHandler = require('../../commonHandler/responseHandler');
const authMiddleware = require('../../middlewares/auth');
const purchaseLicenseMapper = require('./purchaseLicenseMapper');

//generate a new order id
purchaseLicenseRouter.post('/orderId/:corporateId', [purchaseLicenseValidator.validateOrderId, authMiddleware.autntctTkn], (req, res) => {
    const {
        userId, role
    } = req.tokenPayload;
    if(req.params.corporateId !== userId) {
        return responseHandler.sendSuccess(res, purchaseLicenseMapper.generateTokenInvalidError());
    }

    purchaseLicenseFacade.createLicenseOrderId({ corporateId: userId, role })
        .then(result => {
            logger.info(result)
            responseHandler.sendSuccess(res, result)
        })
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        })
});

//purchase a license
purchaseLicenseRouter.post('/purchase', [purchaseLicenseValidator.validatePurchaseLicense, authMiddleware.autntctTkn], (req, res) => { // [purchaseLicenseValidator.validatePurchaseLicense, authMiddleware.autntctTkn],
    const {
        body: {
            orderId,
            purchaseLicenses
        },
        tokenPayload: {
            userId,
            role
        }
    } = req;

    purchaseLicenseFacade.purchaseLicense({corporateId: userId, role, orderId, purchaseLicenses})
        .then(result => 
            responseHandler.sendSuccess(res, result)
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });
});

module.exports = purchaseLicenseRouter;