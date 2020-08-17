const licenseRouter = require('express').Router();
const licenseFacade = require('./licensesFacade');
const responseHandler = require('../../commonHandler/responseHandler');
const licenseValidators = require('./licensesValidators');

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
licenseRouter.post('/addLicense', [licenseValidators.validateLicense], (req, res) => {
    const {
        type,
        price,
    } = req.body;
    licenseFacade.addLicense({type, price})
        .then(result => 
            responseHandler.sendSuccess(res, result)    
        )
        .catch(err => {
            logger.error(err);
            responseHandler.sendError(res, err);
        });
});

module.exports = licenseRouter;