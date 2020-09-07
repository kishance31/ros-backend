const subcategoryRouter = require('express').Router();
const subcategoryFacade = require('./subcategoryFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./subcategoryValidators')
let fileUpload = require('express-fileupload');
subcategoryRouter.use(fileUpload({
    useTempFiles: true
}));
subcategoryRouter.route('/saveSubCategory').post([validators.validateSubCategory],(req, res) => {
    let subcategoryObj = req.body;
    subcategoryFacade.subCategoryAdd(subcategoryObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});

subcategoryRouter.route('/getSubCategoryList').get([],(req, res) => {
   
    subcategoryFacade.getSubCategoryList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

subcategoryRouter.route('/getSubCategoryById/:id').get([],(req, res) => {
    const data = {
        _id: req.params.id
    };
    subcategoryFacade.getSubCategoryById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

subcategoryRouter.route('/updateSubCategory/:id').put([],(req, res) => {
    const data = {
        _id: req.params.id
    };
    subcategoryFacade.updateSubCategoryById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

subcategoryRouter.route('/deleteSubCategory/:id').delete([],(req, res) => {
    const data = {
        _id: req.params.id
    };
    subcategoryFacade.subCategoryDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
//validators.checkUsrValidation, validators.validateSubCategory
subcategoryRouter.route('/getSubCategoryByCategoryId/:id').get([],(req, res) => {
    const data = {
        category_id: req.params.id
    };
    subcategoryFacade.getSubCategoryByCategoryId(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

module.exports = subcategoryRouter;