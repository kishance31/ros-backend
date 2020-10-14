
const User = require('../../model/userModel');
const BaseDao = require('../../dao/baseDao');
const Licenses = require('../../model/licensesModel');
const Branch = require('../../model/branchModel');
const Order = require('../../model/orderModel');
const CartModel = require('../../model/cartModel');
const employeeDao = new BaseDao(User);
const licensesDao = new BaseDao(Licenses);
const branchDao = new BaseDao(Branch);
const orderDao = new BaseDao(Order);
const CartDao = new BaseDao(CartModel);
const mongoose = require('mongoose');
const cartDao = require('../cart/cartDao');
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
            isActive: true,
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
        return await branchDao.findOne({ _id: branch_name });
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
                        { $match: { corporate_admin_id: mongoose.Types.ObjectId(corporateId), isDeleted: false } },
                        {
                            $lookup: {
                                from: 'licenses',
                                localField: 'licenseId',
                                foreignField: "_id",
                                as: "license",
                            }
                        },
                        {
                            $lookup: {
                                from: 'branches',
                                localField: 'branchId',
                                foreignField: "_id",
                                as: "branch",
                            }
                        },
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
        return await employeeDao.aggregate([
            { $match: _query },
            {
                $lookup: {
                    from: 'licenses',
                    localField: 'licenseId',
                    foreignField: "_id",
                    as: "license",
                }
            },
            {
                $lookup: {
                    from: 'branches',
                    localField: 'branchId',
                    foreignField: "_id",
                    as: "branch",
                }
            },
            { $project: projection },
        ]);
    } catch (error) {
        logger.warn(error);
        return null;
    }
}

async function saveEmployee(userInfo, employeeExists) {
    console.log(employeeExists);
    if(employeeExists && employeeExists.isDeleted) {
        updateEmployee({_id: employeeExists._id}, userInfo)
    } else {
        let user = new User(userInfo);
        return await employeeDao.save(user);
    }
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
        query._id = mongoose.Types.ObjectId(data._id);
        console.log(_update)
        let { address, ...others } = _update;
        return await employeeDao.findOneAndUpdate(
            query,
            {
                $set: others,
                $addToSet: { address: {$each: address} }
            },
            { upsert: false });
    } catch (err) {
        console.log(err)
        return err;
    }
};

async function deleteEmployee(data) {
    try {
        let query = {};
        query._id = data._id;


        return await employeeDao.findOneAndUpdate(query, {
            $set: {
                isActive: false,
                isDeleted: true,
            }
        });
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
            // isActive: true,
        };
        let update = {
            $set: { password: data.newPassword, isFirstLogin: false },
        };
        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            upsert: false,
            projection: { ...projection }
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

async function productsOnCart(employeeId, products) {
    return await CartDao.find({ employeeId, products: { $all: [...products] } });
}
async function emptyCart(employeeId) {
    return await CartDao.remove({ employeeId });
}

async function getEmployeeOrder(employeeId, batch = 0, limit = 5) {
    return await orderDao.aggregate([
        {
            $facet: {
                list: [
                    { $match: { employeeId: mongoose.Types.ObjectId(employeeId) } },
                    {
                        $lookup: {
                            from: "products",
                            localField: "products",
                            foreignField: "_id",
                            as: "productDetails",
                        },
                    },
                    { $sort: { updatedAt: -1 } },
                    { $skip: batch * limit },
                    { $limit: limit },
                    {
                        $project: {
                            corporateId: 0,
                            __v: 0,
                            "productDetails.product_cost": 0,
                            "productDetails.ros_cost": 0,
                        }
                    }
                ],
                total: [
                    { $match: { employeeId: mongoose.Types.ObjectId(employeeId) } },
                    { $count: "count" },
                ]
            }
        }
    ])
}

async function cancelEmployeeOrder(orderId) {
    return await orderDao.deleteOne({ _id: orderId, status: { $ne: "confirmed" } });
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
    getOrderListByEmployee,
    productsOnCart,
    emptyCart,
    getEmployeeOrder,
    cancelEmployeeOrder
};
