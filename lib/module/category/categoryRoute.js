const categoryRouter = require('express').Router();
const categoryFacade = require('./categoryFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./categoryValidators')
let fileUpload = require('express-fileupload');
categoryRouter.use(fileUpload({
    useTempFiles: true
}));
categoryRouter.route('/saveCategory').post([validators.validateCategory],(req, res) => {
    let categoryObj = req.body;
    categoryFacade.categoryAdd(categoryObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateCategory
categoryRouter.route('/getCategoryList').get([],(req, res) => {
   
    categoryFacade.getCategoryList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

categoryRouter.route('/getCategoryById/:id').get([],(req, res) => {
    const data = {
        _id: req.params.id
    };
    categoryFacade.getCategoryById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

categoryRouter.route('/updateCategory/:id').put([],(req, res) => {
    const data = {
        _id: req.params.id
    };
    categoryFacade.updateCategoryById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

categoryRouter.route('/deleteCategory/:id').delete([],(req, res) => {
    const data = {
        _id: req.params.id
    };
    categoryFacade.categoryDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
categoryRouter.route('/getCategoryByCorporateId/:id').get([],(req, res) => {
    const data = {
        corporate_admin_id: req.params.id
    };
    categoryFacade.getCategoryByCorporateId(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

module.exports = categoryRouter;