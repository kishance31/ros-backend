/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const adminRouter = require('express').Router();
const adminFacade = require('./adminFacade');
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./adminValidators');

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

adminRouter.route('/logout').post([authMiddleware.autntctTkn], (req, res) => {
    adminFacade.logout({ userId: req.tokenPayload.userId, tokens: req.headers.tokens })
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});

adminRouter.route('/approve/corporate-admin/:corporateUserId')
    .post([authMiddleware.autntctAdminTkn, validators.checkAdminValidation], (req, res) => {
        let { corporateUserId } = req.params;
        adminFacade.approveCorporateUser(req.tokenPayload.userId, corporateUserId).
            then((result) => {
                responseHandler.sendSuccess(res, result);
            })
            .catch((err) => {
                responseHandler.sendError(res, err);
            });
    });

adminRouter.route('/reject/corporate-admin/:corporateUserId')
    .post([authMiddleware.autntctAdminTkn, validators.checkAdminValidation], (req, res) => {
        let { corporateUserId } = req.params;
        adminFacade.rejectCorporateUser(req.tokenPayload.userId, corporateUserId).
            then((result) => {
                responseHandler.sendSuccess(res, result);
            })
            .catch((err) => {
                responseHandler.sendError(res, err);
            });
    });

//validators.validateAdmin,validators.verifyAdminTokenUser]
adminRouter.route('/createAdmin').post([validators.validateAdmin, authMiddleware.autntctAdminTkn], (req, res) => {
    let userObj = req.userDetails;
    // if(req.files){
    //     if(req.files.corpDoc){
    //         userObj.files = req.files.corpDoc
    //     }
    // }
    adminFacade.signup(userObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        });
})
//validators.verifyAdminTokenUser
adminRouter.route('/editAdmin/:adminId').put([authMiddleware.autntctAdminTkn, validators.validateEditAdmin], (req, res) => {
    const data = {
        _id: req.params.adminId
    };
    let obj = req.userDetails;
    adminFacade.editAdmin(data, obj, req.tokenPayload.userId).then((result) => {
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
    return adminFacade.deleteAdminById(data, req.tokenPayload.userId).then((result) => {
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
    return adminFacade.getAdminList(req.tokenPayload.userId).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})

adminRouter.route('/updateAdminStatus/:adminId').put([authMiddleware.autntctAdminTkn, validators.validateStatus], (req, res) => {
    let userObj = {
        isActive: req.body.isActive,
        adminId: req.params.adminId,
        _id: req.tokenPayload.userId,
    }
    return adminFacade.updateAdminStatus(userObj).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
});

adminRouter.route('/getAdminByToken').get([authMiddleware.autntctAdminTkn], (req, res) => {
    let {
        email,
        userId
    } = req.tokenPayload;
    return adminFacade.getUserByToken({ userId, email, tokens: req.headers.tokens }).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    });
});

adminRouter.route('/getCorporateAdmins')
    .get([authMiddleware.autntctAdminTkn], (req, res) => {
        let {
            userId
        } = req.tokenPayload;
        return adminFacade.getCorporateUsers(userId)
            .then((result) => {
                responseHandler.sendSuccess(res, result)
            }).catch((err) => {
                responseHandler.sendError(res, err)
            });
    });

adminRouter.route('/getEmpOrderDetailsByCorporate').get([authMiddleware.autntctAdminTkn], (req, res) => {
    // const data = {
    //     _id: req.params.adminId
    // };
    // let userObj = req.body
    return adminFacade.getEmpOrderDetails(req).then((result) => {
        responseHandler.sendSuccess(res, result)
    }).catch((err) => {
        responseHandler.sendError(res, err)
    })
})

adminRouter.route('/updateEmpOrderDetailsByAdmin/:id').put([authMiddleware.autntctAdminTkn], (req, res) => {
    const data = {

        _id: req.params.id,
    };

    return adminFacade.updateEmpOrderDetailsByAdmin(data, req).then((result) => {
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