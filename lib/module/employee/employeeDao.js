
const User = require('../../model/userModel');
const BaseDao = require('../../dao/baseDao');
const Licenses = require('../../model/licensesModel');
const Branch = require('../../model/branchModel');
const Order = require('../../model/orderModel')
const employeeDao = new BaseDao(User);
const licensesDao = new BaseDao(Licenses);
const branchDao = new BaseDao(Branch);
const orderDao = new BaseDao(Order);
const mongoose = require('mongoose')
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
    try {
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
        return await employeeDao.findOne(query, project);
    } catch (error) {
        return null;
    }
};

async function checkLicenseExists({ type }) {
    try {
        return await licensesDao.findOne({ type });
    } catch (error) {
        return null;
    }
}

async function checkBranchExists(branch_name) {
    try {
        return await branchDao.findOne({ branch_name });
    } catch (error) {
        return null;
    }
}

async function getCorporateEmployees(corporateId, projection, batch = 0, limit = 5) {
    try {
        // return await employeeDao.find({ corporate_admin_id: corporateId }, projection)
        return await employeeDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: { corporate_admin_id: mongoose.Types.ObjectId(corporateId) } },
                        { $project: projection },
                        { $sort: { createdAt: -1 } },
                        { $skip: batch * limit },
                        { $limit: limit },
                    ],
                    total: [
                        { $match: { corporate_admin_id: mongoose.Types.ObjectId(corporateId) } },
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

async function employeeById(_query, projection) {
    try {
        return await employeeDao.findOne(_query, projection);
    } catch (error) {
        return null;
    }
}

async function saveEmployee(userInfo) {
    let user = new User(userInfo);
    return await employeeDao.save(user);
};

async function saveMultipleEmployees(userInfo) {
    return await employeeDao.saveMany(userInfo);
};

async function employeeList() {
    return await employeeDao.find();
}

async function updateEmployee(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await employeeDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function deleteEmployee(data) {
    try {
        let query = {};
        query._id = data._id;


        return await employeeDao.remove(query);
    } catch (err) {
        return err;
    }
};

async function loginEmployee(loginInfo) {
    try {
        let query = {};
        query._id = loginInfo.userId;

        let update = {};
        update['$addToSet'] = { tokens: loginInfo.tokens };

        employeeDao.findOneAndUpdate(query, update);
    } catch (err) {
        console.log(err);
        return null
    }
}

//logout
function logoutUser(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update = {};
        if (data.tokens) {
            update.$pull = { tokens: data.tokens };
        }

        let options = {};
        options.returnNewDocument = data.returnNewDocument;

        return employeeDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        logger.info(err);
    }
};

async function setPassword(data, projection) {
    try {
        let query = {
            _id: data.userId,
            email: data.email,
        };
        let update = {
            $set: {password: data.newPassword, isFirstLogin: false},
        };
        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            upsert: false,
            projection: {...projection}
        }
        return employeeDao.findOneAndUpdate(query, update, options);
    } catch (error) {
        logger.warn(error);
        return null;
    }
}
async function saveEmployeeOrderDetails(orderInfo) {
    let order = new Order(orderInfo);
    return await orderDao.save(order);
};
async function updateOrderDetails(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await orderDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function getOrderListByEmployee(_query) {
    try {
        return await orderDao.aggregate(_query);
    } catch (error) {
        return null;
    }
}

module.exports = {
    employeeById,
    saveEmployee,
    saveMultipleEmployees,
    employeeList,
    updateEmployee,
    deleteEmployee,
    checkLicenseExists,
    checkBranchExists,
    checkIfExist,
    getCorporateEmployees,
    loginEmployee,
    logoutUser,
    setPassword,
    saveEmployeeOrderDetails,
    updateOrderDetails,
    getOrderListByEmployee
};
