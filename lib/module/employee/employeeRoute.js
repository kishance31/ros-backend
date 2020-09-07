const employeeRouter = require('express').Router();
const employeeFacade = require('./employeeFacade');
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./employeeValidators') 
let fileUpload = require('express-fileupload');
employeeRouter.use(fileUpload({
    useTempFiles: true
}));
employeeRouter.route('/saveEmployee').post([validators.checkUsrValidation,validators.validateEmployee],(req, res) => {
    let EmployeeObj = req.body;

    employeeFacade.employeeAdd(EmployeeObj)
    .then((result) => {
       
        responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});

employeeRouter.route('/getEmployeeList').get([validators.checkUsrValidation],(req, res) => {
   
    employeeFacade.getEmployeeList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

employeeRouter.route('/getEmployeeById/:id').get([validators.checkUsrValidation],(req, res) => {
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

employeeRouter.route('/updateEmployee/:id').put([validators.checkUsrValidation],(req, res) => {
    const data = {
        _id: req.params.id
    };
    employeeFacade.updateEmployeeById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

employeeRouter.route('/deleteEmployee/:id').delete([validators.checkUsrValidation],(req, res) => {
    const data = {
        _id: req.params.id
    };
    employeeFacade.EmployeeDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

module.exports = employeeRouter;