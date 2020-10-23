/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */
const mongoose = require('mongoose');
const User = require('../../model/userModel');
const Order = require('../../model/orderModel');
const InvoiceModel = require('../../model/invoiceModel');
const appUtil = require("../../appUtils");
const BaseDao = require('../../dao/baseDao');
const userDao = new BaseDao(User);
const orderDao = new BaseDao(Order);
const invoiceDao = new BaseDao(InvoiceModel);

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
    // if (data.username) {
    //     query.$or.push({ username: data.username });
    // }
    if (data.resetToken) {
        query.$or.push({ resetPasswordToken: data.resetToken, resetTokenExpiration: { $gt: Date.now() } });
    }
    return await userDao.findOne(query, project);
};

async function checkIfUserExist(data) {
    try {
        let query = {
            $or: [],
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
            query.$or.push({ resetPasswordToken: data.resetToken, resetPasswordExpires: { $gt: Date.now() } });
        }
        return await userDao.findOne(query);
    } catch (error) {
        console.log(error)
        return null;
    }
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
        update['$addToSet'] = { tokens: loginInfo.tokens };

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
        update['$set'] = {password: data.password, resetPasswordToken: "", resetPasswordExpires: 0};

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

async function aggregate(_query) {
    return await orderDao.aggregate(_query);
}
async function getEmployeeNames(corporateId) {
    return await userDao.find({ corporate_admin_id: mongoose.Types.ObjectId(corporateId), role: "EMPLOYEE" }, { _id: 1, firstName: 1, lastName: 1, email: 1 });
}
async function updateEmpOrders(data, _update) {
    try {
        let query = {};
        query._id = data._id;
        return await orderDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};
async function getEmployeeDetails(data, project) {
    let query = {};
    query._id = data._id;
    query.role = "EMPLOYEE"
    return await userDao.findOne(query, project);
};

async function confirmEmployeeOrders(orders, paypalDetails) {
    try {
        let orderPromises = orders.map((order) => (
            orderDao.updateOne(
                { orderId: order },
                {
                    $set: {
                        isFirstTimePayment: true,
                    },
                    $addToSet: {
                        paypalDetails: paypalDetails
                    }
                },
                { upsert: false },
            )
        ))
        return await Promise.all(orderPromises);
    } catch (error) {
        logger.warn(error);
    }
}

async function createFirstInvoice(orders, paypalDetails) {
    try {
        let ordersList = await orderDao.find({ orderId: { $in: [...orders] } });
        let invoiceNosPromises = ordersList.map(() => appUtil.generateNumberNanoId());
        let invoiceNos = await Promise.all(invoiceNosPromises);
        let invoiceDetails = ordersList.reduce((acc, order, idx) => {
            const {
                products,
                quantity,
                employeeId,
                corporateId,
                orderId,
                firstPaymentTerm,
                recurringPaymentPending,
                recurringMonthsNo,
            } = order;
            acc.push({
                products,
                quantity,
                employeeId,
                corporateId,
                orderId,
                firstPaymentTerm,
                recurringPaymentPending,
                recurringMonthsNo,
                firstInvoiceDate: new Date(),
                invoiceDetails: [{
                    invoiceNo: invoiceNos[idx],
                    isReccuring: false,
                    invoiceDate: new Date(),
                    paypalDetails: paypalDetails,
                    paymentDone: true,
                    paymentDate: new Date(),
                }]
            })
            return acc;
        }, [])
        await InvoiceModel.insertMany(invoiceDetails);
        return true;
    } catch (error) {
        logger.warn(error)
        return null;
    }
}

async function getInvoiceList(_query, batch, limit) {
    try {
        let query = { corporateId: mongoose.Types.ObjectId(_query.corporateId) };
        // if(_query.isReccuring === true || _query.isReccuring === false) {
        //     query.invoiceDetails = {$elemMatch: {isReccuring: _query.isReccuring}}
        //     // query['invoiceDetails.isReccuring'] = _query.isReccuring
        //     // query.isReccuring === _query.isReccuring;
        // }
        // console.log(query)
        return await invoiceDao.aggregate([
            {
                $facet: {
                    list: [
                        {
                            $match: query,
                        },
                        {
                            $lookup: {
                                from: "products",
                                localField: "products",
                                foreignField: "_id",
                                as: "productDetails",
                            },
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
                            $project: {
                                orderId: 1,
                                firstPaymentTerm: 1,
                                recurringPaymentPending: 1,
                                corporateId: 1,
                                firstInvoiceDate: 1,
                                quantity: 1,
                                recurringMonthsNo: 1,
                                invoiceDetails: {
                                    $filter: {
                                        input: "$invoiceDetails",
                                        as: "invoice",
                                        cond: { $eq: ["$$invoice.isReccuring", _query.isReccuring] }
                                    }
                                },
                                createdAt: 1,
                                updatedAt: 1,
                                "productDetails._id": 1,
                                "productDetails.product_name": 1,
                                "productDetails.product_description": 1,
                                "productDetails.product_image": 1,
                                "productDetails.ros_cod": 1,
                                "productDetails.ros_cost": 1,
                                "employeeDetails.firstName": 1,
                                "employeeDetails.lastName": 1,
                                "employeeDetails.employeeId": 1,
                                "employeeDetails.licenseId": 1,
                            },
                        },
                        { $unwind: "$invoiceDetails" },
                        { $sort: { updatedAt: -1 } },
                        { $skip: batch * limit },
                        { $limit: limit }
                    ],
                    total: [
                        { $match: query },
                        {
                            $project: {
                                invoiceDetails: {
                                    $filter: {
                                        input: "$invoiceDetails",
                                        as: "invoice",
                                        cond: { $eq: ["$$invoice.isReccuring", _query.isReccuring] }
                                    }
                                },
                            }
                        },
                        { $unwind: "$invoiceDetails" },
                        { "$count": "count" }
                    ],
                }
            }
        ])
    } catch (error) {
        console.log(error);
    }
}

async function addOrderPaypalDetails(data) {
    try {
        return await orderDao.findOneAndUpdate(
            {orderId: data.orderId, corporateId: mongoose.Types.ObjectId(data.corporateId),},
            {
                $addToSet: {
                    paypalDetails: data.paypalDetails,
                }
            },
            {upsert: false}
        )
    } catch (error) {
        return null;
    }
}

async function recurringInvoicePaymentUpdate(data) {
    try {
        let query = {
            orderId: data.orderId,
            corporateId: mongoose.Types.ObjectId(data.corporateId),
            "invoiceDetails.invoiceNo": data.invoiceNo
        }
        return await invoiceDao.findOneAndUpdate(
            query,
            {
                $set: {
                    "invoiceDetails.$.paymentDone": true,
                    "invoiceDetails.$.paypalDetails": data.paypalDetails,
                    "invoiceDetails.$.paymentDate": new Date(),
                }
            },
            {upsert: false},
        )
    } catch (error) {
        logger.warn(error);
        return null;
    }
}

async function employeeById(_query) {
    return await userDao.findOne(_query);
}
module.exports = {
    registerUser,
    login,
    checkIfExist,
    checkIfUserExist,
    reset_password,
    updateUser,
    logoutUser,
    findCorporateUserById,
    aggregate,
    updateEmpOrders,
    getEmployeeDetails,
    getEmployeeNames,
    confirmEmployeeOrders,
    createFirstInvoice,
    getInvoiceList,
    addOrderPaypalDetails,
    recurringInvoicePaymentUpdate,
    employeeById
};
