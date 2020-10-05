"use strict";

const PurchasedLicenseModel = require('../../model/purchaseLicenseModel');
const LicenseOrderIdModel = require('../../model/licenseOrderIdModel');
const UserModel = require('../../model/userModel');
const LicenseCountModel = require('../../model/LicenseCountModel');
const BaseDao = require('../../dao/baseDao');
const purchaseLicenseModel = require('../../model/purchaseLicenseModel');
const purchasedLicenseDao = new BaseDao(PurchasedLicenseModel);
const LicenseOrderIdDao = new BaseDao(LicenseOrderIdModel);
const LicenseCountDao = new BaseDao(LicenseCountModel);
const userDao = new BaseDao(UserModel);

exports.checkIfUserExists = async (query) => {
    logger.warn(query);
    return await userDao.findOne(query);
}

exports.createLicenseOrderId = async (data) => {
    await LicenseOrderIdDao.findOneAndUpdate(
        { corporateId: data.corporateId },
        { orderId: data.orderId },
        { upsert: true }
    );
    return { ...data };
}

//check if order id is valid
exports.verifyOrderId = async (orderId) => {
    logger.info(orderId)
    return await LicenseOrderIdDao.findOne({ orderId });
}

exports.purchaseLicenseAdd = async (data) => {
    const purchaseLicenseObj = new purchaseLicenseModel(data);
    return await purchasedLicenseDao.save(purchaseLicenseObj);
}

//check if order id exists in purchaseOrderModel
exports.verfiyPurchaseOrderExists = async (orderId) => {
    return await purchasedLicenseDao.findOne({ orderId });
}

exports.getPurchaseLicenseList = async (corporateId, batch = 0, limit = 5) => {

    return await purchasedLicenseDao.aggregate([
        {
            $facet: {
                list: [
                    { $match: { corporateId } },
                    { $project: { _id: 0, __v: 0, updatedAt: 0, "purchasedLicenses._id": 0, "purchasedLicenses.licenseId": 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: batch * limit },
                    { $limit: limit }
                ],
                total: [{ "$count": "count" }]
            },
        }
    ])
}

exports.getAllPurchaseLicenseList = async (batch = 0, limit = 5) => {
    return await purchasedLicenseDao.aggregate([
        {
            $facet: {
                list: [
                    { $match: {} },
                    { $project: { _id: 0, __v: 0, updatedAt: 0, "purchasedLicenses._id": 0, "purchasedLicenses.licenseId": 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: batch * limit },
                    { $limit: limit }
                ],
                total: [{ "$count": "count" }]
            },
        }
    ])
}

exports.addAvailableLicenseCount = async ({ corporateId, licenseObj }) => {
    return await LicenseCountDao.update(
        { corporateId },
        { $inc: { ...licenseObj } },
        { upsert: true }
    )
}