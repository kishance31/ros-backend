/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const mongoose = require("mongoose");
const promise = require("bluebird");

const User = require('../../model/userModel');
const Order = require('../../model/orderModel');
const appUtil = require("../../appUtils");

const BaseDao = new require('./../../dao/baseDao');
const userDao = new BaseDao(User);
const orderDao = new BaseDao(Order);

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


// Update user
async function updateUser(userId,data) {

    try {
        let query = {};
        query._id = userId;

        let update = {};
        update['$set'] = data;

        return await userDao.findOneAndUpdate(query, update);
    } catch (err) {
        logger.warn(error);
        return null;
    }
};
async function adminById(_query) {
    return await userDao.findOne(_query);
}

async function saveAdmin(userInfo) {
    const hashPassword = await appUtil.convertPass(userInfo.password);
    let user = new User(userInfo);
    user.password = hashPassword;
    return await userDao.save(user);
};

async function adminList(query,batch = 0, limit = 5) {
    // return await userDao.find(query,option);
    try {
        // return await employeeDao.find({ corporate_admin_id: corporateId }, projection)
        return await userDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: query },
                        { $project: {__v: 0, updatedAt: 0} },
                        { $sort: { createdAt: -1 } },
                        // { $skip: batch * limit },
                        { $limit: limit },
                    ],
                    total: [
                        { $match: query },
                        { "$count": "count" }
                    ],
                }
            }
        ])
    } catch (error) {
        logger.warn(error)
        return [];
    }
}

async function deleteAdmin(userId,data) {
    try {
        let query = {};
        query._id = userId;

        let update = {};
        update['$set'] = data;

        return await userDao.findOneAndUpdate(query, update);
    } catch (err) {
        logger.warn(error);
        return null;
    }
};
async function getEmpOrderDetails(query,batch = 0, limit = 5) {
    try {
       
        return await orderDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: query },
                        { $project: {__v: 0, updatedAt: 0} },
                        { $sort: { createdAt: -1 } },
                        // { $skip: batch * limit },
                        { $limit: limit },
                    ],
                    total: [
                        { $match: query },
                        { "$count": "count" }
                    ],
                }
            }
        ])
    } catch (error) {
        logger.warn(error)
        return [];
    }
}
async function aggregate(_query) {
    return await userDao.aggregate(_query);
}
async function updateEmpOrders(data,_update) {
    try {
        let query = {};
        query._id = data._id;
        
       
        return await orderDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};
module.exports = {
    createDefaultAdminUser,
    login,
    checkIfExist,
    updateUser,
    deleteAdmin,
    adminById,
    saveAdmin,
    adminList,
    getEmpOrderDetails,
    aggregate,
    updateEmpOrders
    //checkUserExistByUserId,
    // ,
    // reset_password,
    // updateUser,
    // logoutUser
};