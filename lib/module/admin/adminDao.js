/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const User = require('../../model/userModel');
const AdminFormsModel = require('../../model/adminFormsModel')
const appUtil = require("../../appUtils");

const BaseDao = require('../../dao/baseDao');
const userDao = new BaseDao(User);
const adminFormsDao = new BaseDao(AdminFormsModel);

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
    query.role = "ADMIN";

    let update = {};
    update['$set'] = loginInfo;

    let options = {};
    options.new = true;

    return await userDao.findOneAndUpdate(query, update, options);
};

async function createDefaultAdminForms(info) {
    try {
        return await AdminFormsModel.insertMany(info);    
    } catch (error) {
        logger.warn(error)
        return null;        
    }   
};


module.exports = {
    createDefaultAdminUser,
    login,
    checkIfExist,
    createDefaultAdminForms,
    //checkUserExistByUserId,
    // ,
    // reset_password,
    // updateUser,
    // logoutUser
};