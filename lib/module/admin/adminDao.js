/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const User = require('../../model/userModel');
const Order = require('../../model/orderModel');
const Invoice = require('../../model/invoiceModel');
const purchaseLicenseModel = require('../../model/purchaseLicenseModel');
const adminRolesModel = require('../../model/adminRolesModel');
const AdminFormsModel = require('../../model/adminFormsModel');
const CostSummaryModel = require('../../model/costSummaryModel');
const contactUsModel = require('../../model/contactUsModel');
const EmalTemplatesModel = require('../../model/emailTemplateModel');
const appUtil = require("../../appUtils");
const BaseDao = require('../../dao/baseDao');
const userDao = new BaseDao(User);
const orderDao = new BaseDao(Order);
const invoiceDao = new BaseDao(Invoice);
const purchaseLicenseDao = new BaseDao(purchaseLicenseModel);
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
async function createDefaultAdminForms(info) {
    try {
        return await AdminFormsModel.findOneAndUpdate({}, info, { upsert: true });
    } catch (error) {
        logger.warn(error)
        return null;
    }
};
async function createDefaultCostSUmmary(data) {
    try {
        return await CostSummaryModel.findOneAndUpdate({}, { ...data }, { upsert: true });
    } catch (error) {
        logger.warn(error);
    }
}
async function defaultContactUs(data) {
    try {
        return await contactUsModel.findOneAndUpdate({}, data, { upsert: true, returnNewDocument: true, returnOriginal: false });
    } catch (error) {
        throw new Error(error.message);
    }
};
async function createDefaultEmailTemplates(data) {
    try {
        return await EmalTemplatesModel.insertMany(data);
    } catch (error) {
        throw new Error(error.message);
    }
}
async function checkSuperAdminRoleExist() {
    try {
        return await adminRolesModel.find({roleName: "ROS Super Admin", isDefault: true}).count()
    } catch (error) {
        throw new Error(error.message);
    }
}
async function createSuperAdminRole(data) {
    try {
        return await adminRolesModel.findOneAndUpdate({}, data, { upsert: true, returnNewDocument: true, returnOriginal: false });
    } catch (error) {
        throw new Error(error.message);
    }
}
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

        return await userDao.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "adminroles",
                    foreignField: "_id",
                    localField: "roleName",
                    as: "roleDetails"
                }
            },
            { $project: { password: 0 } }
        ])

        // return await userDao.findOneAndUpdate(query, update, options);
    } catch (error) {
        console.log(error)
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

// Update user
async function updateUser(userId, data, options) {
    try {
        let query = {};
        query._id = userId;

        let update = {};
        update['$set'] = data;

        return await userDao.findOneAndUpdate(query, update, options);
    } catch (err) {
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
    try {
        return await userDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: query },
                        {
                            $lookup: {
                                from: 'adminroles',
                                let: { roleName: "$roleName" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$$roleName", "$_id"]
                                            }
                                        }
                                    },
                                    { $project: { roleName: 1, _id: 0 } },
                                ],
                                as: "roleName",
                            }
                        },
                        { $unwind: "$roleName" },
                        { $project: { firstName: 1, lastName: 1, email: 1, createdAt: 1, mobileNo: 1, isActive: 1, roleName: 1 } },
                        { $sort: { createdAt: -1 } },
                        { $skip: batch * limit },
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
        update['$set'] = { isDeleted: true, isActive: false };

        return await userDao.findOneAndUpdate(query, update);
    } catch (err) {
        logger.warn(error);
        return null;
    }
};
async function getEmpOrderDetails(query, batch = 0, limit = 5) {
    try {

        return await orderDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: query },
                        { $project: { __v: 0, updatedAt: 0 } },
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
async function updateEmpOrders(data, _update) {
    try {
        let query = {};
        query._id = data._id;
        return await orderDao.findOneAndUpdate(query, _update, { upsert: false, returnNewDocument: true, returnOriginal: false });
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

async function getCorporateUsers(batch = 0, limit = 5) {
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
                        { $skip: batch * limit },
                        { $limit: limit },
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
async function updateCorpStatus(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await userDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

const findByResetToken = async (token) => {
    try {
        return await userDao.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
    } catch (error) {
        return null;
    }
}

async function getOrdersByCorporateDetails() {
    return orderDao.aggregate([
        { $match: {} },
        {
            $lookup: {
                from: "users",
                localField: "corporateId",
                foreignField: "_id",
                as: "corporateDetails",
            }
        },
        {
            $unwind: "$corporateDetails"
        },
        {
            $lookup: {
                from: "users",
                localField: "employeeId",
                foreignField: "_id",
                as: "employeeDetails",
            }
        },
        {
            $unwind: "$employeeDetails"
        },
        {
            $lookup: {
                from: "licenses",
                localField: "employeeDetails.licenseId",
                foreignField: "_id",
                as: "employeeDetails.license",
            }
        },
        {
            $unwind: "$employeeDetails.license"
        },
        {
            $lookup: {
                from: "products",
                localField: "products",
                foreignField: "_id",
                as: "productDetails",
            }
        },

        {
            $project: {
                address: 1,
                isFirstTimePayment: 1,
                products: 1,
                productDetails: 1,
                corporateId: 1,
                employeeId: 1,
                orderId: 1,
                status: 1,
                deliveryStatus: 1,
                orderDate: 1,
                createdAt: 1,
                firstPaymentTerm: 1,
                deliveryDate: 1,
                dispatchDate: 1,
                totalOrderCost: 1,
                firstTimeCost: 1,
                "corporateDetails.firstName": 1,
                "corporateDetails.lastName": 1,
                "corporateDetails.companyName": 1,
                "corporateDetails.email": 1,
                "employeeDetails.firstName": 1,
                "employeeDetails.lastName": 1,
                "employeeDetails.licenseId": 1,
                "employeeDetails.license": 1,
                "employeeDetails.email": 1,
            }
        },
        // {
        //     $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$corporateId", 0] }, "$$ROOT"] } }
        // },

        // {
        //     $group: {
        //         _id: "$corporateId",

        //     }
        // }
    ])
}

async function getCorporateOrderInvoice(isReccuring, batch, limit) {
    try {
        return await invoiceDao.aggregate([
            {
                $facet: {
                    list: [
                        {
                            $match: { isReccuring },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "corporateId",
                                foreignField: "_id",
                                as: "corporateDetails",
                            },
                        },
                        {
                            $unwind: "$corporateDetails"
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "employeeId",
                                foreignField: "_id",
                                as: "employeeDetails",
                            },
                        },
                        {
                            $lookup: {
                                from: 'orders',
                                localField: 'orderId',
                                foreignField: "orderId",
                                as: "orderDetails"
                            }
                        },
                        {
                            $project: {
                                orderId: 1,
                                corporateId: 1,
                                firstInvoiceDate: 1,
                                recurringMonthsNo: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                orderDetails: 1,
                                orderDate: 1,
                                isReccuring: 1,
                                invoiceNo: 1,
                                invoiceDate: 1,
                                paymentDone: 1,
                                paymentDate: 1,
                                totalOrderCost: 1,
                                recurringCost: 1,
                                firstTimeCost: 1,
                                "corporateDetails.companyName": 1,
                                "employeeDetails.firstName": 1,
                                "employeeDetails.lastName": 1,
                                "employeeDetails.employeeId": 1,
                                "employeeDetails.licenseId": 1,
                            },
                        },
                        // { $unwind: "$invoiceDetails" },
                        { $sort: { updatedAt: -1 } },
                        { $skip: batch * limit },
                        { $limit: limit }
                    ],
                    total: [
                        { $match: { isReccuring } },
                        // { $unwind: "$invoiceDetails" },
                        { "$count": "count" }
                    ],
                }
            }
        ])
    } catch (error) {
        console.log(error);
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
    getEmpOrderDetails,
    aggregate,
    updateEmpOrders,
    checkRoleExists,
    logout,
    getCorporateUsers,
    updateCorporateStatus,
    updateCorpStatus,
    getOrdersByCorporateDetails,
    getCorporateOrderInvoice,
    createDefaultCostSUmmary,
    defaultContactUs,
    createDefaultEmailTemplates,
    findByResetToken,
    checkSuperAdminRoleExist,
    createSuperAdminRole,
};