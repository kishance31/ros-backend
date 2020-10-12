const employeeRouter = require('express').Router();
const employeeFacade = require('./employeeFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./employeeValidators');
const authMiddleware = require('../../middlewares/auth');

employeeRouter.route('/saveEmployee').post([authMiddleware.autntctTkn, validators.validateEmployee], (req, res) => {
    let EmployeeObj = req.employeeDetails;

    employeeFacade.employeeAdd(EmployeeObj)
        .then((result) => {

            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

employeeRouter.route('/getEmployeeById/:id').get([validators.checkUsrValidation], (req, res) => {
    const data = {
        _id: req.params.id
    };
    employeeFacade.getEmployeeById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

employeeRouter.route('/getEmployeeByCorporateId/:id').post([authMiddleware.autntctTkn, validators.validateTokenId], (req, res) => {
    const {
        batch,
        limit
    } = req.body;
    employeeFacade.getCorporateEmployees(req.params.id, batch, limit)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

employeeRouter.route('/updateEmployee/:id').put([authMiddleware.autntctTkn, validators.validateUpdateEmployee], (req, res) => {
    const data = {
        _id: req.params.id,
        corporate_admin_id: req.employeeDetails.corporate_admin_id,
        email: req.employeeDetails.email,
    };
    employeeFacade.updateEmployeeById(data, req.employeeDetails)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

employeeRouter.route('/deleteEmployee/:id').delete([authMiddleware.autntctTkn, validators.checkUsrValidation], (req, res) => {
    const data = {
        _id: req.params.id
    };
    employeeFacade.employeeDeleteById(data, req.tokenPayload)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

employeeRouter.route('/login').post([validators.validateUserLogin], (req, res) => {
    employeeFacade.loginEmployee(req.loginDetails)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

// logout the user
employeeRouter.route('/logout').get([authMiddleware.autntctTkn], (req, res) => {
    const data = {
        tokens: req.headers.tokens,
        userId: req.tokenPayload.userId,
    };
    employeeFacade.logout(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

employeeRouter.route('/setPassword').post([authMiddleware.autntctTkn, validators.validateSetPassword], (req, res) => {
    const data = {
        ...req.passwordDetails,
        userId: req.tokenPayload.userId,
        email: req.tokenPayload.email,
        tokens: req.headers.tokens,
    }

    employeeFacade.setPassword(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });

});
//authMiddleware.autntctTkn, validators.validateEmployee
employeeRouter.route('/saveMultipleEmployees').post([authMiddleware.autntctTkn,validators.validateMultipleEmployees], (req, res) => {
    let EmployeeObj = req.body;

    employeeFacade.employeeAddMultiple(EmployeeObj)
        .then((result) => {

            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err);
            responseHandler.sendError(res, err);
        });
});

employeeRouter.route('/getEmployeeList').get([authMiddleware.autntctAdminTkn],(req, res) => {

    employeeFacade.getEmployeeList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
//authMiddleware.autntctTkn, validators.validateTokenId
employeeRouter.route('/placeOrder').post([authMiddleware.autntctTkn, validators.validateOrder], (req, res) => {
    let orderObj = req.orderDetails;
    employeeFacade.placeOrder(orderObj)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

employeeRouter.route('/updateOrder/:id').put([authMiddleware.autntctTkn], (req, res) => {
    const data = {
        _id: req.params.id
    };
    employeeFacade.updateOrderDetails(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
//authMiddleware.autntctTkn
employeeRouter.route('/getOrderListByEmployee/:id').get([authMiddleware.autntctTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    employeeFacade.getOrderListByEmployee(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
employeeRouter.route('/getEmployeeOrder/:id/:batch/:limit').get([authMiddleware.autntctTkn, validators.validatePagination],(req, res) => {
    const {batch, limit} = req.pagination;
    employeeFacade.getEmployeeOrder(req.params.id, batch, limit)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
employeeRouter.route('/cancelEmployeeOrder/:id').post([authMiddleware.autntctTkn],(req, res) => {
    employeeFacade.cancelEmployeeOrder(req.params.id)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
employeeRouter.route('/deactivateEmployee/:id').post([authMiddleware.autntctTkn],(req, res) => {
    let data = {
        deactivationReason: req.body.reason,
        status: "Deactivated",
    }
    employeeFacade.deactiveEmployee(req.params.id, data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
employeeRouter.route('/activateEmployee/:id').post([authMiddleware.autntctTkn],(req, res) => {
    let data = {
        deactivationReason: "",
        status: "APPROVED",
    }
    employeeFacade.deactiveEmployee(req.params.id, data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});
module.exports = employeeRouter;