

const appUtils = require("../../appUtils");
const cartConstants = require("./cartConstants");
const cartMapper = require("./cartMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");



function checkUsrValidation(req, res, next) {

    let token = req.headers['tokens']
    let { id } = req.params
    if (!token) {

        res.json(cartMapper.responseMapping(cartConstants.CODE.FRBDN, cartConstants.MESSAGES.TOKEN_NOT_PROVIDED))

    } else {

        jwtHandler.verifyUsrToken(token).then((result) => {

            if (result) {

                next()
            } else {


                res.json(cartMapper.responseMapping(cartConstants.CODE.FRBDN, cartConstants.MESSAGES.TOKEN_NOT_PROVIDED))
            }
        }).catch((err) => {

            console.log({ err })
            res.json(cartMapper.responseMapping(cartConstants.CODE.FRBDN, cartConstants.MESSAGES.TOKEN_NOT_PROVIDED))
        })
    }
}


const validateCart = function (req, res, next) {
    let { products, employeeId } = req.body;
    const errors = [];

    if (_.isEmpty(products)) {
        errors.push({ fieldName: "cart_name", message: cartConstants.MESSAGES.productIdCantEmpty });
    }
    if (_.isEmpty(employeeId)) {
        errors.push({ fieldName: "cart_name", message: cartConstants.MESSAGES.employeeCantEmpty });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
}
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(cartConstants.MESSAGES.validationError, errors));
    }
    next();
};

module.exports = {
    validateCart,
    checkUsrValidation
}