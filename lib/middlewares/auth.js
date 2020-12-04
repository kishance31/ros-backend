"use strict";

//========================== Load Modules Start ===========================
var promise = require("bluebird");
var jwtHandler = require("./../commonHandler/jwtHandler");
const exceptions = require('../commonHandler/customException');
const UserModel = require("../model/userModel");

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
            req.tokenPayload = tokenPayload  
            next();
        })
        .catch(function (err) {
            console.log("err",err)
            next(err);
        });
};

var autntctAdminTkn =  function (req, res, next) {
    var acsToken = req.headers['tokens'];
    __verifyTok(acsToken)
        .then(async function (tokenPayload) {
            req.userId = tokenPayload.user_id;
            req.email = tokenPayload.email;
            req.tokenPayload = tokenPayload
            if (tokenPayload.role !== 'ADMIN') {
                return res.send({
                    "status": 403,
                    "message": "You Don't have permission to access.",
                    "data": {}
                });
            }
            next();
        })
        .catch(function (err) {
            console.log("err",err)
            next(err);
        });
};

const checkUserActive = async (req, res, next) => {
    try {
        console.log(req.tokenPayload);
        let result = await UserModel.findOne({email: req.tokenPayload.email, isDeleted: false, status: {$ne: "REJECTED"}})
        if(result) {
            next();
        } else {
            next("Error verifying user. Please contact ROS Admin.");
        }
    } catch (err) {
        console.log("err",err)
            next(err);
    }
}

module.exports = {
    autntctTkn,
    autntctAdminTkn,
    checkUserActive
};

//========================== Export Module End ===========================
