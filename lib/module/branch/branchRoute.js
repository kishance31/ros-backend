const branchRouter = require('express').Router();
const branchFacade = require('./branchFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./branchValidators')
let fileUpload = require('express-fileupload');
branchRouter.use(fileUpload({
    useTempFiles: true
}));
const authMiddleware = require('../../middlewares/auth')

branchRouter.route('/saveBranch').post([authMiddleware.autntctTkn, validators.validateBranch], (req, res) => {
    // let branchObj = { company_name, email_id, location, mobile_no, corporate_admin_id } = req.body;
    branchFacade.branchAdd(req.branchDetails)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

branchRouter.route('/getBranchList').get([validators.checkUsrValidation], (req, res) => {

    branchFacade.getBranchList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

branchRouter.route('/getBranchById/:id').get([validators.checkUsrValidation], (req, res) => {
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

branchRouter.route('/updateBranch/:id').put([authMiddleware.autntctTkn, validators.validateBranch], (req, res) => {
    const data = {
        _id: req.params.id,
        corporate_admin_id: req.branchDetails.corporate_admin_id
    };
    branchFacade.updateBranchById(data, req.branchDetails)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

branchRouter.route('/deleteBranch/:id').delete([authMiddleware.autntctTkn, validators.checkBranchId], (req, res) => {
    const data = {
        _id: req.params.id,
        corporate_admin_id: req.tokenPayload.userId
    };
    branchFacade.branchDeleteById(data, req.tokenPayload.userId)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
branchRouter.route('/getBranchByCorporateId/:id')
    .post([validators.checkUsrValidation, authMiddleware.autntctTkn, validators.validateTokenId], (req, res) => {

        const data = {
            corporate_admin_id: req.params.id
        };
        const { batch, limit } = req.body;

        branchFacade.getBranchByCorporateId(data, batch, limit)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

branchRouter.route('/getCorporateBranchNames/:id')
    .get([authMiddleware.autntctTkn, validators.validateTokenId], (req, res) => {
        branchFacade.getCorporateBranchNames(req.params.id)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

module.exports = branchRouter;