const userRouter = require('express').Router();
const userFacade = require('./userFacade');
const responseHandler = require('../responseHandler');
const validators = require('./userValidators')
const jwtHandler = require('../jwtHandler');

userRouter.route('/register').post([validators.requiredCheck], (req,res) => {   
    console.log("data:::::::::::::", req.body); 
    let userObj = req.body;
    userFacade.signup(userObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });  
});

userRouter.route('/loginUser').post((req, res) => {
    userFacade.loginUser(req).then(result => {
        responseHandler.successResponse(res, result);
    }).catch(err => {
        responseHandler.errorHandler(res, err);
    });
});


userRouter.route('/forgetPassword').post((req, res) => {
    userFacade.forgetPassword(req).then(result => {
        responseHandler.sendSuccess(res, result);
    }).catch(err => {
        responseHandler.sendError(res, err);
    });
});

//  Reset Password
userRouter.route('/resetPassword').post((req, res) => {
    userFacade.resetPassword(req).then(result => {
        responseHandler.sendSuccess(res, result);
    }).catch(err => {
        responseHandler.sendError(res, err);
    });
});
