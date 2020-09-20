/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const User = require('../../model/userModel');
const adminRolesModel = require('../../model/adminRolesModel')
const appUtil = require("../../appUtils");

const BaseDao = require('../../dao/baseDao');
const userDao = new BaseDao(User);
const adminRolesDao = new BaseDao(adminRolesModel);

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
    logger.debug('check if exist', data);
    let query = {
        $or: [],
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

async function checkRoleExists (roleName) {
    try {
        return await adminRolesDao.findOne({roleName});
    } catch (error) {
        return null;
    }
}

module.exports = {
    createDefaultAdminUser,
    login,
    checkIfExist,
    createDefaultAdminForms,
    updateUser,
    deleteAdmin,
    adminById,
    saveAdmin,
    adminList,
    checkRoleExists
    //checkUserExistByUserId,
    // ,
    // reset_password,
    // updateUser,
    // logoutUser
};