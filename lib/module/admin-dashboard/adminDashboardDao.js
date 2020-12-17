const mongoose = require('mongoose');
const UserModel = require('../../model/userModel');
const purchaseLicenseModel = require('../../model/purchaseLicenseModel');
const orderModel = require('../../model/orderModel');
const ProductModel = require('../../model/productModel');

exports.corporateUserCount = async (dt) => {
    try {
        let query = {
            role: 'CORPORATE_ADMIN',
            isActive: true,
        };
        if (dt) {
            query.createdAt = { $gte: new Date(dt) }
        }
        return await UserModel.find(query).countDocuments()
    } catch (error) {
        logger.warn(error);
        return 0
    }
}

exports.employeeUserCount = async (dt) => {
    try {
        let query = {
            role: 'EMPLOYEE',
            isActive: true,
            isDeleted: false,
        };
        if (dt) {
            query.createdAt = { $gte: new Date(dt) }
        }
        return await UserModel.find(query).countDocuments()
    } catch (error) {
        logger.warn(error);
        return 0
    }
}

exports.purchaseLicenseCount = async (dt) => {
    try {
        let query = {};
        if (dt) {
            query.createdAt = { $gte: new Date(dt) }
        }
        return await purchaseLicenseModel.aggregate([
            { $match: query },
            { $unwind: "$purchasedLicenses" },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$purchasedLicenses.quantity"
                    }
                }
            }
        ])
    } catch (error) {
        logger.warn(error);
        return 0;
    }
}

exports.totalLicenseIncome = async (dt) => {
    try {
        let query = {};
        if (dt) {
            query.createdAt = { $gte: new Date(dt) }
        }
        return await purchaseLicenseModel.aggregate([
            { $match: query },
            { $unwind: "$purchasedLicenses" },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$purchasedLicenses.totalPrice"
                    }
                }
            }
        ])
    } catch (error) {
        logger.warn(error);
        return 0;
    }
}


exports.newOrderIncome = async (dt) => {
    try {
        let query = {
            isFirstTimePayment: true,
        };
        if (dt) {
            query.createdAt = { $gte: new Date(dt) }
        }
        return await orderModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$firstTimeCost"
                    }
                }
            }
        ])
    } catch (error) {
        logger.warn(error);
        return 0;
    }
}

exports.recurringIncome = async (dt) => {
    try {
        let query = {
            isFirstTimePayment: true,
        };
        if (dt) {
            query.createdAt = { $gte: new Date(dt) }
        }
        return await orderModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$recurringCost"
                    }
                }
            }
        ])
    } catch (error) {
        logger.warn(error);
        return 0;
    }
}

exports.productsCount = async () => {
    try {
        return await productModel.find({}).countDocuments();
    } catch (error) {
        return 0;
    }
}

exports.getCustomerSignupCount = async () => {
    try {
        return await UserModel.aggregate(
            [
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        count: { $sum: 1 },
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]
        )
    } catch (error) {
        return 0;
    }
}

exports.salesByProductCategory = async () => {
    try {
        return await orderModel.aggregate(
            [
                {
                    $lookup: {
                        from: "categories",
                        localField: "products.category_id",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $project: {
                        totalOrderCost: 1,
                        categoryDetails: 1,
                    }
                },
                {
                    $group: {
                        _id: "$categoryDetails.category_name",
                        count: { $sum: "$totalOrderCost" }
                    }
                }
            ]
        )
    } catch (error) {
        return 0;
    }
}

exports.topProfitMarginProducts = async () => {
    try {
        return await ProductModel.aggregate(
            [
                {
                    $project: {
                        product_name: 1,
                        margin: { $subtract: ["$ros_cost", "$product_cost"] }
                    }
                },
                {
                    $sort: { margin: -1 }
                }
            ]
        )
    } catch (error) {
        return 0;
    }
}