"use strict";

const mongoose = require('mongoose');
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

exports.getPurchaseLicense = async (_id) => {
    return await purchasedLicenseDao.findOne({ _id });
}

exports.getPurchaseLicenseList = async (corporateId, batch = 0, limit = 5) => {

    return await purchasedLicenseDao.aggregate([
        {
            $facet: {
                list: [
                    { $match: { corporateId: mongoose.Types.ObjectId(corporateId) } },
                    {
                        $lookup: {
                            from: "licenses",
                            localField: "purchasedLicenses.licenseId",
                            foreignField: "_id",
                            as: "licenseDetails",
                        }
                    },
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
                    {
                        $lookup: {
                            from: "users",
                            localField: "corporateId",
                            foreignField: "_id",
                            as: "corporateDetails",
                        }
                    },
                    {
                        $unwind: "$corporateDetails",
                    },
                    {
                        $lookup: {
                            from: "licenses",
                            localField: "purchasedLicenses.licenseId",
                            foreignField: "_id",
                            as: "licenseDetails",
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            corporateId: 1,
                            createdAt: 1,
                            licenseDetails: 1,
                            orderId: 1,
                            purchasedLicenses: 1,
                            isActive: 1,
                            "corporateDetails.companyName": 1

                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $skip: batch * limit },
                    { $limit: limit }
                ],
                total: [{ "$count": "count" }]
            },
        }
    ])
}

exports.getLicenseCount = async (query) => {
    try {
        return await LicenseCountDao.findOne(query);
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.addLicenseCount = async (data) => {
    try {
        let licenseCountDoc = new LicenseCountModel(data)
        return await LicenseCountModel.create(licenseCountDoc);
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateAvailableLicenseCount = async ({ corporateId, licenses }) => {

    try {
        return await LicenseCountDao.findOneAndUpdate(
            { corporateId },
            { $set: { licenses } },
            { upsert: false, returnNewDocument: true, returnOriginal: false },
        )
    } catch (error) {
        throw new Error(error.message);
    }

    // try {
    //     return await LicenseCountDao.findOneAndUpdate(
    //         { corporateId },
    //         {
    //             $addToSet: {
    //                 licenses: 
    //             }
    //         },
    //         { upsert: true }
    //     )
    // } catch (error) {
    //     console.log(error);

    //     throw new Error(error.message);
    // }


    // try {
    //     return await LicenseCountDao.update(
    //         { corporateId, "licenses.licenseId": {} },
    //         { $inc: { "licenses.$.count": licenseObj.count }, $addToSet: {'licenses.$.randomLicenseId': {$each: licenseObj.randomLicenseId}} },
    //         { upsert: true }
    //     )
    // } catch (error) {
    //     console.log(error);
    //     if(error.message.indexOf("The positional operator did not find the match") != -1) {
    //         return await LicenseCountDao.findOneAndUpdate(
    //             { corporateId},
    //             { "licenses": licenseObj },
    //             { upsert: true, returnNewDocument: true, returnOriginal: false }
    //         )
    //     }
    //     throw new Error(error.message);
    // }
}

exports.activatePurchaseLicense = async (_id, isActive) => {
    return await purchasedLicenseDao.findOneAndUpdate(
        { _id },
        { isActive },
        { upsert: false }
    )
}

exports.getEmployeeByRandomId = async (randomLicenseIds) => {
    await userDao.updateMany(
        { randomLicenseId: { $in: randomLicenseIds } },
        { $set: { isActive: false, isFirstLogin: false } },
        { upsert: false, projection: { _id: 0, randomLicenseId: 1 }, returnOriginal: true },
    );
    return await userDao.find(
        { randomLicenseId: { $in: randomLicenseIds } },
        { _id: 0, randomLicenseId: 1 }
    )
}