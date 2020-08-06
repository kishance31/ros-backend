const userRouter = require('express').Router();
const userFacade = require('./userFacade');
const middleware = require("../middlewares");
const responseHandler = require('../responseHandler');
const validators = require('./userValidators')
const jwtHandler = require('../jwtHandler');
let fileUpload = require('express-fileupload');
userRouter.use(fileUpload({
    useTempFiles: true
}));
userRouter.route('/register').post([validators.requiredCheck], (req, res) => {
    let userObj = req.body;
    userObj.files = req.files.corpDoc
    userFacade.signup(userObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
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

// forgot password
userRouter.route('/forgot_password').post((req, res) => {
    const userObj = { email } = req.body;
    userFacade.forgot_password(userObj)
        .then(result => {
            console.log(result);
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);

        });
});

//  Reset Password
userRouter.route('/reset').post([validators.validateResetPassword], (req, res) => {
    const data = { password, resetToken } = req.body;;
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

module.exports = userRouter;