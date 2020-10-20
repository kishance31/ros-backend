const userRouter = require('express').Router();
const userFacade = require('./corporateAdminFacade');
const middleware = require("../../middlewares");
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./corporateAdminValidators')
const jwtHandler = require('./../../commonHandler/jwtHandler');
const authMiddleware = require('../../middlewares/auth');
let fileUpload = require('express-fileupload');

// userRouter.use(fileUpload({
//     useTempFiles: true
// }));

userRouter.route('/register').post([validators.requiredCheck], (req, res) => {
    let userObj = req.body;
    userObj.files = req.files.corpDoc
    userFacade.signup(userObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

// Login route
userRouter.route('/login').post([validators.validateLogin], (req, res) => {
    const userObj = { email, password } = req.body;
    userFacade.login(userObj).
        then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});

// Update User
userRouter.route('/update').post([validators.validateUpdateUser, authMiddleware.autntctTkn], (req, res) => {
    if(req.files && req.files.corpDoc) {
        req.user.corpDoc = req.files.corpDoc;
    }
    userFacade.updateUser(req.user, req.tokenPayload.userId, req.headers.tokens)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});

// forgot password
userRouter.route('/forgot_password').post((req, res) => {
    const userObj = { email } = req.body;
    userFacade.forgot_password(userObj)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);

        });
});

//  Reset Password
userRouter.route('/reset').post([validators.validateResetPassword], (req, res) => {
    const data = { password, new_password, confirm_password } = req.body;
    userFacade.resetPassword(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

// Get owner detail route
userRouter.route('/get-user').get([middleware.authenticate.autntctTkn], (req, res) => {
    const data = {
        userId: req.userId,
        email: req.email
    };
    userFacade.getUser(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

// logout the user
userRouter.route('/logout').get([middleware.authenticate.autntctTkn], (req, res) => {
    const data = {
        tokens: req.headers.tokens,
        userId: req.tokenPayload.userId,
    };
    userFacade.logout(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

userRouter.route('/getEmployeeOrderDetails/:batch/:limit').post([middleware.authenticate.autntctTkn, validators.validatePagination], (req, res) => {
    const data = {
        corporateId: req.tokenPayload.userId,
    };
    userFacade.getEmployeeOrders(data, req)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

userRouter.route('/updateEmployeeOrderDetails/:id').put([middleware.authenticate.autntctTkn], (req, res) => {

    const data = {

        _id: req.params.id,
    };
    userFacade.updateEmployeeOrders(data, req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
userRouter.route('/getEmployeeNames').get([middleware.authenticate.autntctTkn], (req, res) => {
    userFacade.getEmployeeNames(req.tokenPayload.userId)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
userRouter.route('/confirmEmployeeOrders').post([middleware.authenticate.autntctTkn, validators.validateConfirmPayment], (req, res) => {
    userFacade.confirmEmployeeOrders(req.orders, req.paypalDetails, req.tokenPayload.userId)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

userRouter.route('/sendEmailToEmployee/:id').post([middleware.authenticate.autntctTkn], (req, res) => {
    const data = {

        _id: req.params.id,
    };
    userFacade.sendMail(data)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

userRouter.route('/getInvoiceList/:batch/:limit').post([middleware.authenticate.autntctTkn, validators.validatePagination], (req, res) => {
    const data = {
        corporateId: req.body.corporateId,
        isReccuring: req.body.isReccuring,
    };
    const {
        batch, limit
    } = req.pagination;
    userFacade.getInvoiceList(data, batch, limit)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

userRouter.route('/recurringInvoicePayment').post([middleware.authenticate.autntctTkn, validators.validateRecurringPayment], (req, res) => {
    const data = {
        corporateId: req.corporateId,
        orderId: req.orderId,
        paypalDetails: req.paypalDetails,
        invoiceNo: req.invoiceNo
    };
    userFacade.recurringInvoicePayment(data)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

userRouter.route('/sendOrderToVendor').post([], (req, res) => {
 
    userFacade.sendOrderToVendor(req.body)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

module.exports = userRouter;