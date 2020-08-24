const branchRouter = require('express').Router();
const branchFacade = require('./branchFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./branchValidators')

branchRouter.route('/saveBranch').post([validators.checkUsrValidation,validators.validateBranch],(req, res) => {
    let branchObj = req.body;
    branchFacade.branchAdd(branchObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});

branchRouter.route('/getBranchList').get([validators.checkUsrValidation],(req, res) => {
   
    branchFacade.getBranchList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

branchRouter.route('/getBranchById/:id').get([validators.checkUsrValidation],(req, res) => {
    const data = {
        _id: req.params.id
    };
    branchFacade.getBranchById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

branchRouter.route('/updateBranch/:id').put([validators.checkUsrValidation,validators.validateBranch],(req, res) => {
    const data = {
        _id: req.params.id
    };
    branchFacade.updateBranchById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

branchRouter.route('/deleteBranch/:id').delete([validators.checkUsrValidation],(req, res) => {
    const data = {
        _id: req.params.id
    };
    branchFacade.branchDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
branchRouter.route('/getBranchByCorporateId/:id').get([validators.checkUsrValidation],(req, res) => {
    const data = {
        corporate_admin_id: req.params.id
    };
    branchFacade.getBranchByCorporateId(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

module.exports = branchRouter;