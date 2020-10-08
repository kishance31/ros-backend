const cartRouter = require('express').Router();
const cartFacade = require('./cartFacade');
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./cartValidator')
let fileUpload = require('express-fileupload');
cartRouter.use(fileUpload({
    useTempFiles: true
}));
//authMiddleware.autntctTkn
cartRouter.route('/addToCart').post([authMiddleware.autntctTkn, validators.validateCart],(req, res) => {
    let {products, employeeId} = req.body;
    cartFacade.cartAdd({products, employeeId})
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateCart
cartRouter.route('/getCartList').get([authMiddleware.autntctTkn],(req, res) => {
   
    cartFacade.getCartList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

cartRouter.route('/getCartById/:id').get([authMiddleware.autntctTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cartFacade.getCartById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cartRouter.route('/deleteCart/:id').delete([authMiddleware.autntctTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    cartFacade.cartDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
cartRouter.route('/getCartByEmployeeId/:id').get([authMiddleware.autntctTkn],(req, res) => {
    // const data = {
    //     employeeId: req.params.id
    // };
    cartFacade.getCartByEmployeeId(req.params.id)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

cartRouter.route('/removeProductFromCart').post([authMiddleware.autntctTkn],(req, res) => {
    cartFacade.removeProductFromCart(req.body.employeeId, req.body.productId)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})


module.exports = cartRouter;