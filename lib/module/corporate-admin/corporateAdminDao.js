/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const User = require('../../model/userModel');
const appUtil = require("../../appUtils");
const BaseDao = require('../../dao/baseDao');
const userDao = new BaseDao(User);

/**
 * find corporater-admin by _id, and update the object
 *
 * @async
 * @desc update corporate user object
 *
 * @param {object} query - Query parameters
 * @param {object} user  - User object
 *
 * @returns {*|Promise<any | never>}
 */
async function findCorporateUserById(_query, _update) {
    return await userDao.findOneAndUpdate(_query, _update);
}

/**
 * find corporater-admin by _id, email, username
 *
 * @async
 * @desc update corporate user object
 *
 * @param {object} data - Query parameters
 *
 * @returns {*|Promise<any | never>}
 */
async function checkIfExist(data, project) {
    let query = {
        $or: [],
        role: "CORPORATE_ADMIN",
    };
    if (data.userId) {
        query.$or.push({ _id: data.userId });
    }
    if (data.email) {
        query.$or.push({ email: data.email });
    }
    if (data.username) {
        query.$or.push({ username: data.username });
    }
    if (data.resetToken) {
        query.$or.push({ resetToken: data.resetToken, resetTokenExpiration: { $gt: Date.now() } });
    }
    return await userDao.findOne(query, project);
};

/**
 * create/save new corporate-admin user
 *
 * @async
 * @desc accessed to store new corporate user
 *
 * @param {object} user - corporater-admin user object
 *
 * @returns {*|Promise<any | never>}
 */
async function registerUser(userInfo) {
    const hashPassword = await appUtil.convertPass(userInfo.password);
    let user = new User(userInfo);
    user.password = hashPassword;
    return await userDao.save(user);
};

function login(loginInfo) {
    try {
        let query = {};
        query._id = loginInfo.userId;

        let update = {};
        update['$addToSet'] = {tokens: loginInfo.tokens};

        userDao.findOneAndUpdate(query, update);
    } catch (err) {
        console.log(err);
        return null
    }
};

// Update user
async function updateUser(data, userId, options) {
    try {
        let query = {};
        query._id = userId;

        let update = {};
        update['$set'] = data;

        return await userDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        logger.warn(error);
        return null;
    }
};

// Reset password
function reset_password(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update = {};
        update['$set'] = data;

        let options = {};
        options.returnNewDocument = data.returnNewDocument;

        return userDao.findOneAndUpdate(query, update, options);
    } catch (error) {

    }
};

//logout
function logoutUser(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update= {};
        if (data.tokens) {
            update.$pull = { tokens: data.tokens };
        }

        let options = {};
        options.returnNewDocument = data.returnNewDocument;

        return userDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        logger.info(err);
    }
};

module.exports = {
    registerUser,
    login,
    checkIfExist,
    reset_password,
    updateUser,
    logoutUser,
    findCorporateUserById
};
