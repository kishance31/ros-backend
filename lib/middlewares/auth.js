"use strict";

//========================== Load Modules Start ===========================
var promise = require("bluebird");
var jwtHandler = require("./../commonHandler/jwtHandler");

var __verifyTok = function (acsTokn) {
    return jwtHandler.verifyUsrToken(acsTokn)
        .then(function (tokenPayload) {
            return tokenPayload;
        })
        .catch(function (err) {
            throw err;
        });
};

var autntctTkn = function (req, res, next) {
    var acsToken = req.headers['tokens'];
    __verifyTok(acsToken)
        .then(function (tokenPayload) {
            req.userId = tokenPayload.user_id;
            req.email = tokenPayload.email;
            next();
        })
        .catch(function (err) {
            console.log("err",err)
            next(err);
        });
};


module.exports = {
    autntctTkn
};

//========================== Export Module End ===========================
