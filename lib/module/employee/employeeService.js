'use strict';


const employeeDao = require('./employeeDao');
const employeeMapper = require('./employeeMapper');
const employeeConstants = require("./employeeConstants");
const licenseServices = require('../licenses/licensesService')
const appUtils = require('../../appUtils');
// const crypto = require('crypto');

// Chech if user exist
async function isUserExist(details, projection) {
    return await employeeDao.checkIfExist(details, projection);
};

async function checkEmployeeDetails(EmployeeDetails) {
    // check corporate admin exists
    const isExist = await isUserExist({ userId: EmployeeDetails.corporate_admin_id });
    if (!isExist) {
        return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.userNoPermission);
    }

    //check license type is correct
    const licenseExists = await licenseServices.decrementLicenseCount({
        corporateId: EmployeeDetails.corporate_admin_id,
        licenseType: EmployeeDetails.licenseType,
    }, false);
    if (licenseExists.responseCode !== 201) {
        return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, licenseExists.responseMessage);
    }

    //check branch name is correct
    const branchExists = await employeeDao.checkBranchExists(EmployeeDetails.branchName)
    if (!branchExists) {
        return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.incorrectBranchName);
    }

    return null;
}

async function employeeAdd(EmployeeDetails) {
    logger.debug(`Inside Employeeservices`);
    try {

        const checkedEmployeeDetails = await checkEmployeeDetails(EmployeeDetails)
        if (checkedEmployeeDetails) {
            return checkedEmployeeDetails;
        }

        const employeeExists = await employeeDao.employeeById({ email: EmployeeDetails.email });
        if (employeeExists) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.emailExists);
        }
        EmployeeDetails.role = "EMPLOYEE";
        EmployeeDetails.status = "APPROVED";
        EmployeeDetails.isActive = false;
        EmployeeDetails.isFirstLogin = true;
        EmployeeDetails.address = EmployeeDetails.address || [];

        //encrypt password
        const Password = await appUtils.convertPass(EmployeeDetails.password);
        EmployeeDetails.password = Password;

        // const buff = await crypto.randomBytes(64);
        // const token = await buff.toString('hex');

        // EmployeeDetails.tokens = token

        //save employee
        return employeeDao.saveEmployee(EmployeeDetails).then((data) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Added)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        });

    } catch (err) {
        logger.warn(err)
        return err;
    }
};


function employeeList() {
    try {
        return employeeDao.employeeList().then((data) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.EmployeeList, employeeConstants.MESSAGES.Success, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getEmployeeById(id) {
    try {
        return employeeDao.employeeById(id).then((data) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_By_Id, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }

}

async function getCorporateEmployees(corporateId, batch, limit) {
    try {
        const projection = {
            resetTokenIsUsed: 0,
            updatedAt: 0,
            __v: 0,
            tokens: 0,
            password: 0,
            role: 0,
            corporate_admin_id: 0,
            isFirstLogin: 0,
        };

        // check corporate admin exists
        const isExist = await isUserExist({ userId: corporateId });
        if (!isExist) {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.userNoPermission);
        }

        // Get Corporate employee
        return employeeDao.getCorporateEmployees(corporateId, projection, batch, limit).then((data) => {
            return employeeMapper.responseMappingEmployees(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Listed, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })

    } catch (error) {
        logger.warn(error)
        return error;
    }
}

async function employeeEditById(id, data) {
    try {

        const checkedEmployeeDetails = await checkEmployeeDetails(data);
        if (checkedEmployeeDetails) {
            return checkedEmployeeDetails;
        }

        const employeeExists = await employeeDao.employeeById({ email: data.email, _id: id });
        if (!employeeExists) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        }

        return employeeDao.updateEmployee(id, data).then((result) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Update, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        });
    } catch (err) {
        return err;
    }
}

async function deleteEmployee(id, userDetails) {
    try {

        // check corporate admin exists
        const isExist = await isUserExist({ userId: userDetails.userId });
        if (!isExist) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.userNoPermission);
        }

        const employeeExists = await employeeDao.employeeById({ _id: id });
        if (!employeeExists) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        }

        return employeeDao.deleteEmployee(id).then((data) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Deleted)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}
module.exports = {
    employeeAdd,
    employeeList,
    getEmployeeById,
    employeeEditById,
    deleteEmployee,
    getCorporateEmployees,
};