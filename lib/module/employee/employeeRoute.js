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

module.exports = employeeRouter;