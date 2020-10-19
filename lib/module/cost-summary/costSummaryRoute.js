const costSummaryRouter = require('express').Router();
const costSummaryFacade = require('./costSummaryFacade');
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./costSummaryValidators')
let fileUpload = require('express-fileupload');
costSummaryRouter.use(fileUpload({
    useTempFiles: true
}));
costSummaryRouter.route('/saveCostSummary').post([authMiddleware.autntctAdminTkn, validators.validateCostSummary],(req, res) => {
    costSummaryFacade.costSummaryAdd(req.costSummaryDetails, req.tokenPayload.userId)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateCostSummary


costSummaryRouter.route('/getCostSummary').get([authMiddleware.autntctAdminTkn],(req, res) => {
    costSummaryFacade.getCostSummaryById()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

costSummaryRouter.route('/updateCostSummary/:id').put([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    costSummaryFacade.updateCostSummaryById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})


module.exports = costSummaryRouter;