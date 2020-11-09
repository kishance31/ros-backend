const mongoose = require('mongoose');
const UserModel = require('../../model/userModel');
const purchaseLicenseModel = require('../../model/purchaseLicenseModel');
const orderModel = require('../../model/orderModel');
const productModel = require('../../model/productModel');

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