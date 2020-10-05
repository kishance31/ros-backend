"use strict";

const _ = require("lodash");
const purchaseLicenseDao = require('./purchaseLicenseDao');
const purchaseLicenseMapper = require('./purchaseLicenseMapper');
const licensesService = require('../licenses/licensesService');
const appUtils = require('../../appUtils');

const checkIfExists = async (query) => {
    return await purchaseLicenseDao.checkIfUserExists(query);
}

exports.generateOrderId = async (data) => {
    const {
        corporateId,
        role,
    } = data;

    try {
        const userExists = await checkIfExists({ _id: corporateId, role });
        if (userExists) {
            const orderId = "ROS-" + await appUtils.generateNumberNanoId();
            const orderDetails = await purchaseLicenseDao.createLicenseOrderId({ corporateId: corporateId, orderId });
            return purchaseLicenseMapper.generateOrderIdSuccess(orderDetails);
        }
        return purchaseLicenseMapper.generateOrderIdError();
    } catch (error) {
        logger.warn(error);
        return purchaseLicenseMapper.generateOrderIdError();
    }
}

const verfiyLicenseOrderId = async (orderId) => {
    return await purchaseLicenseDao.verifyOrderId(orderId)
}

const verfiyPurchaseOrder = async (orderId) => {
    return await purchaseLicenseDao.verfiyPurchaseOrderExists(orderId);
}

//purchase a license
exports.purchaseLicense = async (data) => {
    const {
        corporateId,
        role,
        orderId,
        purchaseLicenses,
        paypalDetails
    } = data;
    let licenseObj = {};
    try {

        const userExists = await checkIfExists({ _id: corporateId, role });

        //check if order id is valid
        const orderIdExists = await verfiyLicenseOrderId(orderId);
        if (!orderIdExists || (orderIdExists.corporateId != corporateId)) {
            return purchaseLicenseMapper.orderIdNotExists(orderId);
        }

        //check if order id is repeated
        //if repeated order id then return
        const alreadyPurchasedOrder = await verfiyPurchaseOrder(orderId);
        if (alreadyPurchasedOrder) {
            return purchaseLicenseMapper.orderIdNotExists(orderId);
        }

        if (userExists) {
            const licenseTypes = purchaseLicenses.map(license => license.type);
            const { licenseList } = await licensesService.getLicensesByTypes(licenseTypes);
            let purchaseLicenseDetails = licenseList.map(license => {
                let selectedLicense = purchaseLicenses.find(purchase => purchase.type === license.type);
                licenseObj[license.type] = selectedLicense.quantity;
                return {
                    type: license.type,
                    quantity: selectedLicense.quantity,
                    licenseId: license._id,
                    totalPrice: selectedLicense.quantity * license.price
                }
            });
            let licenseCount = await purchaseLicenseDao.addAvailableLicenseCount({corporateId, licenseObj});
            let finalData = {
                corporateId,
                orderId,
                purchasedLicenses: purchaseLicenseDetails,
                paypalDetails
            }
            if(licenseCount) {
                let result = await purchaseLicenseDao.purchaseLicenseAdd(finalData);
                if (result) {
                    return purchaseLicenseMapper.purchaseLicenseSuccess(finalData);
                }
            }
            return purchaseLicenseMapper.purchaseLicenseError();
        }
        return purchaseLicenseMapper.invalidUserError();
    } catch (error) {
        logger.warn(error);
        return purchaseLicenseMapper.purchaseLicenseError();
    }
}

exports.getPurchasedLicenses = async (data) => {
    const {
        corporateId,
        role,
        batch,
        limit
    } = data;

    try {
        const userExists = await checkIfExists({ _id: corporateId, role });
        if (userExists) {
            const result = await purchaseLicenseDao.getPurchaseLicenseList(corporateId, batch, limit);
            return purchaseLicenseMapper.getPurchaseLicenseList(result);
        }
        return purchaseLicenseMapper.invalidUserIdError();
    } catch (error) {
        logger.warn(error);
        return purchaseLicenseMapper.getPurchaseLicenseError();
    }
}

exports.getAllPurchasedLicenses = async (data) => {
    const {
        adminId,
        batch,
        limit
    } = data;

    try {
        const userExists = await checkIfExists({ _id: adminId, role: "ADMIN", isActive: "true" });
        if (userExists) {
            const result = await purchaseLicenseDao.getAllPurchaseLicenseList(batch, limit);
            return purchaseLicenseMapper.getPurchaseLicenseList(result);
        }
        return purchaseLicenseMapper.invalidUserIdError();
    } catch (error) {
        logger.warn(error);
        return purchaseLicenseMapper.getPurchaseLicenseError();
    }
}
