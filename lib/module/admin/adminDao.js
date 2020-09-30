/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const User = require('../../model/userModel');
const Order = require('../../model/orderModel');
const adminRolesModel = require('../../model/adminRolesModel');
const AdminFormsModel = require('../../model/adminFormsModel');
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
    try {
        let query = {
            $or: [],
            role: "ADMIN",
            isActive: true,
        };
        if (data.email) {
            query.$or.push({ email: data.email });
        }
        if (data.id) {
            query.$or.push({ _id: data.id });
        }
        if (data.username) {
            query.$or.push({ username: data.username });
        }

        return await userDao.findOne(query);
    } catch (error) {
        return null;
    }
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
    try {
        let query = {};
        query._id = loginInfo.userId;
        query.role = "ADMIN";

        let update = {};
        // update['$addToSet'] = { tokens: loginInfo.tokens };

        let options = {};
        options.new = true;

        return await userDao.findOneAndUpdate(query, update, options);
    } catch (error) {
        return null;
    }
};

//logout
function logout(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update = {};
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

async function createDefaultAdminForms(info) {
    try {
        return await AdminFormsModel.insertMany(info);
    } catch (error) {
        logger.warn(error)
        return null;
    }
};


// Update user
async function updateUser(userId, data, options) {

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
async function adminById(_query) {
    return await userDao.findOne(_query);
}

async function saveAdmin(userInfo) {
    const hashPassword = await appUtil.convertPass(userInfo.password);
    let user = new User(userInfo);
    user.password = hashPassword;
    return await userDao.save(user);
};

async function adminList(query, batch = 0, limit = 5) {
    // return await userDao.find(query,option);
    try {
        // return await employeeDao.find({ corporate_admin_id: corporateId }, projection)
        return await userDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: query },
                        { $project: { firstName: 1, lastName: 1, email: 1, createdAt: 1, mobileNo: 1, isActive: 1, roleName: 1 } },
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

async function deleteAdmin(userId) {
    try {
        let query = {};
        query._id = userId;

        let update = {};
        update['$set'] = { isDeleted: true };

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

async function checkRoleExists(roleName) {
    try {
        return await adminRolesDao.findOne({ roleName });
    } catch (error) {
        return null;
    }
}

async function getCorporateUsers() {
    try {
        return await userDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: { role: "CORPORATE_ADMIN" } },
                        {
                            $project: {
                                tokens: 0, isFirstLogin: 0, isDeleted: 0, roleName: 0, resetTokenIsUsed: 0, password: 0, role: 0, __v: 0
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        // { $skip: batch * limit },
                        // { $limit: limit },
                    ],
                    total: [
                        { $match: { role: "CORPORATE_ADMIN" } },
                        { "$count": "count" }
                    ],
                }
            }
        ])
    } catch (error) {
        return [];
    }
}

async function updateCorporateStatus(corporateId, status) {
    try {
        return await userDao.findOneAndUpdate(
            { _id: corporateId, role: "CORPORATE_ADMIN" },
            { $set: { status } },
            { upsert: false }
        );
    } catch (err) {
        return null;
    }
};

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
    getEmpOrderDetails,
    aggregate,
    updateEmpOrders,
    checkRoleExists,
    logout,
    getCorporateUsers,
    updateCorporateStatus
    //checkUserExistByUserId,
    // ,
    // reset_password,
    // updateUser,
    // logoutUser
};