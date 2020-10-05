const productRouter = require('express').Router();
const productFacade = require('./productFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const authMiddleware = require('../../middlewares/auth');
const validators = require('./productValidators');

productRouter.route('/saveProduct').post([authMiddleware.autntctAdminTkn, validators.validateProduct],(req, res) => {
    let productObj = req.productDetails;
    if(req.files){
        if(req.files.product_image){
            productObj.files = req.files.product_image
        }
    }
    console.log(productObj);
    productFacade.productAdd(productObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateProduct
productRouter.route('/getProductList').post([authMiddleware.autntctTkn],(req, res) => {
    productFacade.getProductList(req)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

productRouter.route('/getProductById/:id').get([authMiddleware.autntctTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    productFacade.getProductById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

productRouter.route('/updateProduct/:id').put([validators.validateProduct,authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };

    productFacade.updateProductById(data,req.body,req)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

productRouter.route('/deleteProduct/:id').delete([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    productFacade.productDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

productRouter.route('/getProductByLicense/:id').get([authMiddleware.autntctTkn],(req, res) => {
    const data = {
        license_id: req.params.id
    };
    productFacade.getProductByLicense(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})


module.exports = productRouter;