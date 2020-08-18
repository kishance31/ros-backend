"use strict";

const PurchasedLicenseModel = require('../../model/purchaseLicenseModel');
const LicenseOrderIdModel = require('../../model/licenseOrderIdModel');
const UserModel = require('../../model/userModel');
const BaseDao = require('../../dao/baseDao');
const purchaseLicenseModel = require('../../model/purchaseLicenseModel');
const purchasedLicenseDao = new BaseDao(PurchasedLicenseModel);
const LicenseOrderIdDao = new BaseDao(LicenseOrderIdModel);
const userDao = new BaseDao(UserModel);

exports.checkIfUserExists = async (query) => {
    return await userDao.findOne(query);
}

exports.createLicenseOrderId = async (data) => {
    await LicenseOrderIdDao.findOneAndUpdate(
        {corporateId: data.corporateId},
        {orderId: data.orderId},
        {upsert: true}
    );
    return { ...data };
}

//check if order id is valid
exports.verifyOrderId = async (orderId) => {
    logger.info(orderId)
    return await LicenseOrderIdDao.findOne({orderId});
}

exports.purchaseLicenseAdd = async (data) => {
    const purchaseLicenseObj = new purchaseLicenseModel(data);
    return await purchasedLicenseDao.save(purchaseLicenseObj);
}

//check if order id exists in purchaseOrderModel
exports.verfiyPurchaseOrderExists = async (orderId) => {
    return await purchasedLicenseDao.findOne({orderId});
}