/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const mongoose = require("mongoose");
const promise = require("bluebird");

const User = require('../../model/userModel');
const appUtil = require("../../appUtils");

const BaseDao = new require('./../../dao/baseDao');
const userDao = new BaseDao(User);

/**
 * Check admin users exist or not
 *
 * @async
 * @desc to make sure there are no duplicate admin resides in whole system
 *
 * @param {object} user - User in Application
 *
 * @returns {*|Promise<any | never>}
 */
async function checkIfExist(data) {  
    logger.debug('check if exist');
    let query = {
        $or: []
    };
    if (data.email) {
        query.$or.push({ email: data.email });
    }
    if (data.username) {
        query.$or.push({ username: data.username });
    }
    
    return await userDao.findOne(query);    
};

/**
 * Create default admin user account
 *
 * @async
 * @desc to manage system, there must be default admin user required
 *
 * @param {object} user - User in Application
 *
 * @returns {*|Promise<any | never>}
 */
async function createDefaultAdminUser(userInfo) {    
    const hashPassword = await appUtil.convertPass(userInfo.password);
    let user = new User(userInfo);
    user.password = hashPassword;
    return await userDao.save(user);    
};

/**
 * Admin authentication 
 *
 * @async
 * @desc to manage system, there must be default admin user required
 *
 * @param {object} user - User in Application
 *
 * @returns {*|Promise<any | never>}
 */
async function login(loginInfo) {
    let query = {};
    query._id = loginInfo.userId;

    let update = {};
    update['$set'] = loginInfo;

    let options = {};
    options.new = true;

    return await userDao.findOneAndUpdate(query, update, options);
};


module.exports = {
    createDefaultAdminUser,
    login,
    checkIfExist,
    //checkUserExistByUserId,
    // ,
    // reset_password,
    // updateUser,
    // logoutUser
};