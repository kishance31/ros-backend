/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const adminRouter = require('express').Router();
const adminFacade = require('./adminFacade');
const middleware = require("../../middlewares");
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./adminValidators');
const jwtHandler = require('./../../commonHandler/jwtHandler');
const loggerConfig = require('../../config/loggerConfig');

adminRouter.route('/login').post([validators.validateLogin], (req, res) => {
    const userObj = { email, password } = req.body;
    
    adminFacade.login(userObj).
        then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});


adminRouter.route('/approve/corporate-admin/:corporateUserId').post([validators.checkAdminValidation], (req, res) => {
    let { corporateUserId } = req.params;
    adminFacade.approveCorporateUser(corporateUserId).
        then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});


adminRouter.route('/reject/corporate-admin/:corporateUserId').post([validators.checkAdminValidation], (req, res) => {
    let { corporateUserId } = req.params;
    adminFacade.rejectCorporateUser(corporateUserId).
        then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});
//checkAdminValidation,authMiddleware.autntctTkn
//validators.validateAdmin,validators.verifyAdminTokenUser]
adminRouter.route('/createAdmin').post([validators.validateAdmin,authMiddleware.autntctAdminTkn], (req, res) => {
    let userObj = req.body
    if(req.files){

        if(req.files.corpDoc){

            userObj.files = req.files.corpDoc
        }
    }
    adminFacade.signup(userObj).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})
//validators.verifyAdminTokenUser
adminRouter.route('/editAdmin/:adminId').put([validators.validateAdmin], (req, res) => {
    const data = {
        _id: req.params.adminId
    };
        let obj = req.body;
        adminFacade.editAdmin(data,obj,req).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})
//validators.verifyAdminTokenUser
adminRouter.route('/deleteAdmin/:adminId').put([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.adminId
    };
    let userObj = {
        isDeleted : true
    }
    return adminFacade.deleteAdminById(data,userObj).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})
//validators.verifyAdminTokenUser
adminRouter.route('/getAdminById/:adminId').get([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {
        _id: req.params.adminId
    };
  
    return adminFacade.getAdminById(data).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})
//validators.verifyAdminToken
adminRouter.route('/getAdmins').get([authMiddleware.autntctAdminTkn], (req, res) => {
    return adminFacade.getAdminList().then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})

adminRouter.route('/updateAdminStatus/:adminId').put([], (req, res) => {
    const data = {
        _id: req.params.adminId
    };
    let userObj = req.body
    return adminFacade.updateAdminStatus(data,userObj).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})

// forgot password
// userRouter.route('/forgot_password').post((req, res) => {
//     const userObj = { email } = req.body;
//     userFacade.forgot_password(userObj)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);

//         });
// });

//  Reset Password
// userRouter.route('/reset').post([validators.validateResetPassword], (req, res) => {
//     const data = {password, new_password, confirm_password } = req.body;
//     userFacade.resetPassword(data)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);
//         });
// });

// Get owner detail route
// userRouter.route('/get-user').get([middleware.authenticate.autntctTkn], (req, res) => {
//     const data = {
//         userId: req.userId,
//         email: req.email
//     };
//     userFacade.getUser(data)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);
//         });
// });

// // logout the user
// userRouter.route('/logout').get([middleware.authenticate.autntctTkn], (req, res) => {
//     const data = {
//         token: req.headers.tokens,
//         userId: req.userId,
//     };
//     userFacade.logout(data)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })       
//         .catch(err => {
//             responseHandler.sendError(res, err);
//         });
// });

module.exports = adminRouter;