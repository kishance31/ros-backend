

const appUtils = require("../../appUtils");
const branchConstants = require("./branchConstants");
const branchMapper = require("./branchMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");



function checkUsrValidation(req, res, next) {

    let token = req.headers['authorization']
    let { id } = req.params
    if (!token) {

        res.json(branchMapper.responseMapping(branchConstants.CODE.FRBDN, branchConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    } else {

        jwtHandler.verifyUsrToken(token).then((result) => {

            if (result) {

                next()
            } else {


                res.json(branchMapper.responseMapping(branchConstants.CODE.FRBDN, branchConstants.MESSAGES.TOKEN_NOT_PROVIDED))
            }
        }).catch((err) => {

            console.log({ err })
            res.json(branchMapper.responseMapping(branchConstants.CODE.FRBDN, branchConstants.MESSAGES.TOKEN_NOT_PROVIDED))
        })
    }
}


const validateBranch = function (req, res, next) {
    const errors = [];


    if (_.isEmpty(req.body)) {
        errors.push({ fieldName: "error", message: branchConstants.MESSAGES.ValidDetails });
    } 
   

    next();
}


module.exports = {
    validateBranch,
    checkUsrValidation
}