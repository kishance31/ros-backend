'use strict';


const employeeDao = require('./employeeDao');
const employeeMapper = require('./employeeMapper');
const employeeConstants = require("./employeeConstants");
const appUtils = require('../../appUtils');
const crypto = require('crypto');

async function employeeAdd(EmployeeDetails) {
    logger.debug(`Inside Employeeservices`);
    try {
        EmployeeDetails.role = "EMPLOYEE";
        EmployeeDetails.status = "PENDING";
        EmployeeDetails.isActive = false;
        EmployeeDetails.isFirstLogin = true;
        const Password = await appUtils.convertPass(EmployeeDetails.password);
        const buff = await crypto.randomBytes(64);
        const token = await buff.toString('hex');

        EmployeeDetails.password = Password;
        EmployeeDetails.tokens = token
        EmployeeDetails.isFirstLogin = true;
       
        return employeeDao.saveEmployee(EmployeeDetails).then((data) => {


            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Added, data)


        }).catch((err) => {

            console.log({ err })
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })

    } catch (err) {
        return err;
    }
};


function employeeList() {
    try {
        return employeeDao.employeeList().then((data) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.EmployeeList, employeeConstants.MESSAGES.Success, data)


        }).catch((err) => {

            console.log({ err })
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
function employeeEditById(id, data) {
    try {
        return  employeeDao.updateEmployee(id, data).then((data) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Update, data)

        }).catch((err)=>{
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteEmployee(id) {
    try {
        return employeeDao.deleteEmployee(id).then((data) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Deleted)

        }).catch((err)=>{
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
    deleteEmployee

};