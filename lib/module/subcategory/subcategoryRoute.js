const subcategoryRouter = require('express').Router();
const subcategoryFacade = require('./subcategoryFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const authMiddleware = require('../../middlewares/auth');
const validators = require('./subcategoryValidators')
let fileUpload = require('express-fileupload');
subcategoryRouter.use(fileUpload({
    useTempFiles: true
}));
subcategoryRouter.route('/saveSubCategory').post([validators.validateSubCategory,authMiddleware.autntctAdminTkn],(req, res) => {
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

subcategoryRouter.route('/getSubCategoryList').get([authMiddleware.autntctTkn],(req, res) => {
   
    subcategoryFacade.getSubCategoryList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

subcategoryRouter.route('/getSubCategoryById/:id').get([authMiddleware.autntctTkn],(req, res) => {
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

subcategoryRouter.route('/updateSubCategory/:id').put([validators.validateSubCategory,authMiddleware.autntctAdminTkn],(req, res) => {
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

subcategoryRouter.route('/deleteSubCategory/:id').delete([authMiddleware.autntctAdminTkn],(req, res) => {
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
subcategoryRouter.route('/getSubCategoryByCategoryId/:id').get([authMiddleware.autntctTkn],(req, res) => {
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
subcategoryRouter.route('/updateSubCategoryStatus/:id').put([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    subcategoryFacade.updateSubCategoryStatusById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
module.exports = subcategoryRouter;