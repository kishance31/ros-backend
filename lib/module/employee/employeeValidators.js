const appUtils = require("../../appUtils");
const employeeConstants = require("./employeeConstants");
const employeeMapper = require("./employeeMapper");
const exceptions = require("../../commonHandler/customException");
const jwtHandler = require("../../commonHandler/jwtHandler");
const _ = require('lodash');
const loggerConfig = require("../../config/loggerConfig");

function checkUsrValidation(req, res, next) {
  let token = req.headers['tokens'];
  let { id } = req.params;
  if (!token) {
    res.json(
      employeeMapper.responseMapping(
        employeeConstants.CODE.FRBDN,
        employeeConstants.MESSAGES.TOKEN_NOT_PROVIDED
      )
    );
  } else {
    jwtHandler
      .verifyUsrToken(token)
      .then((result) => {
        if (result) {
          next();
        } else {
          res.json(
            employeeMapper.responseMapping(
              employeeConstants.CODE.FRBDN,
              employeeConstants.MESSAGES.TOKEN_NOT_PROVIDED
            )
          );
        }
      })
      .catch((err) => {
        console.log({ err });
        res.json(
          employeeMapper.responseMapping(
            employeeConstants.CODE.FRBDN,
            employeeConstants.MESSAGES.TOKEN_NOT_PROVIDED
          )
        );
      });
  }
}

const validateEmployee = function (req, res, next) {
  let companyName = req.body.companyName;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  const errors = [];

  if (_.isEmpty(companyName)) {
    errors.push({
      fieldName: "companyName",
      message: employeeConstants.MESSAGES.companyNameCantEmpty,
    });
  } else if (_.isEmpty(firstName)) {
    errors.push({
      fieldName: "firstName",
      message: employeeConstants.MESSAGES.FirstNameCantEmpty,
    });
  } else if (_.isEmpty(password)) {
    errors.push({
      fieldName: "password",
      message: employeeConstants.MESSAGES.PasswordCantEmpty,
    });
  } else if (_.isEmpty(username)) {
    errors.push({
      fieldName: "username",
      message: employeeConstants.MESSAGES.UserNameCantEmpty,
    });
  } else if (_.isEmpty(lastName)) {
    errors.push({
      fieldName: "lastName",
      message: employeeConstants.MESSAGES.LastNameCantEmpty,
    });
  } else if (_.isEmpty(email)) {
    errors.push({
      fieldName: "email",
      message: employeeConstants.MESSAGES.EmailCantEmpty,
    });
  } else {
    if (!appUtils.isValidEmail(email)) {
      errors.push({
        fieldName: "email",
        message: employeeConstants.MESSAGES.InvalidEmail,
      });
    }
  }

  if (errors && errors.length > 0) {
    validationError(errors, next);
  }

  next();
};
const validationError = function (errors, next) {
  if (errors && errors.length > 0) {
      return next(exceptions.getCustomErrorException(employeeConstants.MESSAGES.validationError, errors));
  }
  next();
};
module.exports = {
  validateEmployee,
  checkUsrValidation,
};
