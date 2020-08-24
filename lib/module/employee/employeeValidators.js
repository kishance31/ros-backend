

const appUtils = require("../../appUtils");
const employeeConstants = require("./employeeConstants");
const employeeMapper = require("./employeeMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");



function checkUsrValidation(req, res, next) {

    let token = req.headers['tokens']
    let { id } = req.params
    if (!token) {

        res.json(employeeMapper.responseMapping(employeeConstants.CODE.FRBDN, employeeConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    } else {
        jwtHandler.verifyUsrToken(token).then((result) => {
            
            if (result) {
                next()
            } else {
                
                res.json(employeeMapper.responseMapping(employeeConstants.CODE.FRBDN, employeeConstants.MESSAGES.TOKEN_NOT_PROVIDED))
            }
        }).catch((err) => {

            console.log({ err })
            res.json(employeeMapper.responseMapping(employeeConstants.CODE.FRBDN, employeeConstants.MESSAGES.TOKEN_NOT_PROVIDED))
        })
    }
}


const validateEmployee = function (req, res, next) {
    const errors = [];


    if (_.isEmpty(req.body)) {
        errors.push({ fieldName: "error", message: employeeConstants.MESSAGES.ValidDetails });
    } 
   

    next();
}


module.exports = {
    validateEmployee,
    checkUsrValidation
}