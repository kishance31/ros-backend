'use strict';

const crypto = require('crypto');

const promise = require("bluebird");
const _ = require("lodash");
const sendgridTransport = require('@sendgrid/mail')
const userDao = require('./corporateAdminDao');
const appUtils = require('../../appUtils');
const userMapper = require('./corporateAdminMapper');
let fileUpload = require('express-fileupload');
const config = require('../../config');
const jwtHandler = require('./../../commonHandler/jwtHandler');
const loggerConfig = require('../../config/loggerConfig');
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dljkawvlg',
    api_key: '228612331659815',
    api_secret: 'kbXvRMrdv4UV9NCbqcX29_m8zJI'
})

// User signup
async function signupUser(usrDetails) {
    logger.debug(`Inside signup corporate-admin services`);
    try {
        const exist = await userDao.checkIfExist(usrDetails);
        if (exist) {
            return userMapper.userExist();
        }

        // Initialized 
        usrDetails.role = "CORPORATE_ADMIN";
        usrDetails.status = "PENDING";
        usrDetails.isActive = false;

        const buff = crypto.randomBytes(64);
        const token = buff.toString('hex');
        const resetTokenExpiration = Date.now() + 3600000;
        corporate_confirmation_mail(usrDetails.email, token);
        let corpDoc = usrDetails.files;
        if (corpDoc) {
            const resultTemp = await cloudinary.uploader.upload(corpDoc.tempFilePath)
            usrDetails.corpDoc = resultTemp.secure_url
        }
        const data = await userDao.registerUser(usrDetails);
        if (data) {
            return userMapper.registerMapping(data._id);
        }
    } catch (err) {
        return err;
    }
};

// Send mail
function corporate_confirmation_mail(email, token) {
    sendgridTransport.setApiKey(config.cfg.API_SECRET)
    const url = `http://localhost:4000/confirmation/${token}`
    let mailOptions = {
        to: email,
        from: 'shivangi.dubey@codezeros.com',
        subject: 'Corporate Profile Request',
        html: `
            <P>Thank you for your registration, <a href='${url}'> Register Here </a>After admin approval you will be able to login into your account </P>
        `
    };
    sendgridTransport.send(mailOptions).catch((e) => {
        console.log('error', e);
    });
};

// Chech if user exist
async function isUserExist(details) {
    try {
        return await userDao.checkIfExist(details);
    } catch (err) {
        return err;
    }
};

// Update user document
async function loginUser(data) {
    try {
        return await userDao.login(data);
    } catch (err) {
        return err;
    }
};

function send_mail(email, token) {
    sendgridTransport.setApiKey(config.cfg.API_SECRET)
    let mailOptions = {
        to: email,
        from: 'shivangi.dubey@codezeros.com',
        subject: 'Reset Password ',
        html: `
        <P>You requested a password reset</P>
        <P>Click this <a href="http://localhost:4000/auth/reset-password/${token}">link</a> to set a new password.</P>
        `
    };
    sendgridTransport.send(mailOptions).catch((e) => {
        console.log('error', e);
    });
}

// Forgot password
async function forgot_password(details) {
    try {
        const resetToken = await jwtHandler.genUsrToken({ user_id: details._id, email: details.email }) 
        const resetTokenExpiration = Date.now() + 3600000;
        const query = {
            userId: details._id,
            email: details.email,
            resetToken,
            resetTokenExpiration,
            returnNewDocument: false,
            resetTokenIsUsed: false
        };
        await userDao.updateUser(query);
        send_mail(details.email, resetToken);
        return userMapper.emailSent();
    } catch (err) {
        console.log(err);
        return err;
    }
};

// Reset password
async function resetPassword(data) {
    try {
        const user = await userDao.checkIfExist(data);
        if (!user) {
            return userMapper.resetTokenExpireOrNotFound();
        }
        if (user.resetTokenIsUsed) {
            return userMapper.linkAlreadyUsed();
        }
        const newPassword = await appUtils.convertPass(data.password);
        const updateData = {
            userId: user._id,
            newPassword,
            returnNewDocument: true,
            resetTokenIsUsed: true
        };
        const result = await userDao.reset_password(updateData);
        if (result) {
            return userMapper.passwordChanged();
        }

    } catch (err) {
        return err;
    }
};

// Get user data
async function getUser(data) {
    try {
        const user = await userDao.checkIfExist(data);
        if (!user) {
            return userMapper.userNotExist();
        }
        return userMapper.userFetched(user);
    } catch (err) {
        return err;
    }
};

// Logout
async function logout(data) {
    try {
        const isExist = await userDao.checkIfExist(data);
        if (!isExist) {
            return userMapper.userNotExist();
        }
        data.returnNewDocument = true;
        await userDao.logoutUser(data);
        return userMapper.logoutSuccess();
    } catch (err) {
        return err;
    }
};
module.exports = {
    signupUser,
    isUserExist,
    forgot_password,
    loginUser,
    logout,
    resetPassword,
    getUser,
};