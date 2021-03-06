const productRouter = require('express').Router();
const productFacade = require('./productFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const authMiddleware = require('../../middlewares/auth');
const validators = require('./productValidators');

productRouter.route('/saveProduct').post([validators.validateProduct], (req, res) => {
    let productObj = req.productDetails;
    if (req.files) {
        if (req.files.product_images) {
            productObj.files = req.files.product_images
        }
    }
    // responseHandler.sendSuccess(res, true);
    productFacade.productAdd(productObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateProduct
productRouter.route('/getAllProductList/:batch?/:limit?').post([authMiddleware.autntctTkn, validators.validatePagination], (req, res) => {
    let prodDetails = { product_name, category_id, sub_category_id, license_id } = req.body
    let { batch, limit } = req.pagination;
    productFacade.getAllProductList(prodDetails, batch, limit, req.tokenPayload.role)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateProduct
productRouter.route('/getProductList/:batch?/:limit?').post([authMiddleware.autntctTkn, validators.validatePagination], (req, res) => {
    let prodDetails = { product_name, category_id, sub_category_id, license_id } = req.body
    let { batch, limit } = req.pagination;
    productFacade.getProductList(prodDetails, batch, limit, req.tokenPayload.role)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

productRouter.route('/getProductById/:id').get([authMiddleware.autntctTkn], (req, res) => {
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

productRouter.route('/updateProduct/:id').put([validators.validateProduct, authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.id
    };

    productFacade.updateProductById(data, req.productDetails, req)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

productRouter.route('/deleteProduct/:id').delete([authMiddleware.autntctAdminTkn], (req, res) => {
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

productRouter.route('/getProductByLicense/:id').get([authMiddleware.autntctTkn], (req, res) => {
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
});

productRouter.route('/updateProductStatus/:id').put([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.id
    };
console.log(req.body)
    productFacade.updateProductById(data, { status: req.body.status }, req)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

module.exports = productRouter;