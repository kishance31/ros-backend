const productRouter = require('express').Router();
const productFacade = require('./productFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./productValidators');

productRouter.route('/saveProduct').post([validators.validateProduct],(req, res) => {
    let productObj = req.body;
    if(req.files){

        if(req.files.product_image){

            productObj.files = req.files.product_image
        }
    }
  
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
productRouter.route('/getProductList').get([],(req, res) => {
   
    productFacade.getProductList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

productRouter.route('/getProductById/:id').get([],(req, res) => {
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

productRouter.route('/updateProduct/:id').put([],(req, res) => {
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

productRouter.route('/deleteProduct/:id').delete([],(req, res) => {
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


module.exports = productRouter;