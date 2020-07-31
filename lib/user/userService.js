'use strict';

//========================== Load Modules Start =======================
//========================== Load internal modules ====================
const crypto = require('crypto');

const promise = require("bluebird");
// const _ = require("lodash");
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const userDao = require('./userDao');
const appUtils   = require('../appUtils');
const userMapper = require('./userMapper');

// User signup
async function signupUser(usrDetails) {
    console.log("signup111111:::::", usrDetails);
    try {
        const exist = await userDao.checkIfExist(usrDetails);

        if (exist) {
            return userMapper.userExist();
        }

        const data = await userDao.registerUser(usrDetails);

        if (data) {
            console.log("testdata:::::::::::::", data);
            return userMapper.registerMapping(data._id);
        }

    } catch (err) {
        return err;
    }
};

module.exports = {
    signupUser
    // isUserExist,
    // forgot_password,
    // send_mail,
    // search,
    // updateUserData,
    // logout,
    // resetPassword,
    // getUser,
    // removeUser
};