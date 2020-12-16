"use strict";

const _ = require("lodash");
const purchaseLicenseDao = require('./purchaseLicenseDao');
const purchaseLicenseMapper = require('./purchaseLicenseMapper');
const licensesService = require('../licenses/licensesService');
const appUtils = require('../../appUtils');
const mailHandler = require('../../commonHandler/mailHandler');
const mongoose = require("mongoose");
const e = require("express");

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
            const orderId = "LIC-" + await appUtils.generateNumberNanoId();
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

const updateLicenseCount = async (corporateId, licenses) => {
    try {
        let availableLicCount = await purchaseLicenseDao.getLicenseCount({ corporateId });
        if (availableLicCount) {
            let availableLicenses = [...availableLicCount._doc.licenses];
            for (let i = 0; i < availableLicenses.length; i++) {
                let lic = availableLicenses[i];
                for (let j = 0; j < licenses.length; j++) {
                    let newLic = licenses[j];
                    if (lic._id.toString() == newLic._id.toString()) {
                        console.log("euql")
                        lic.count += newLic.count;
                        lic.randomLicenseId = [...lic.randomLicenseId, ...newLic.randomLicenseId]
                        newLic.done = true;
                    }
                }
            }
            let pendingLic = licenses.filter(lic => !lic.done);
            availableLicenses = [...availableLicenses, ...pendingLic];
            await purchaseLicenseDao.updateAvailableLicenseCount({ corporateId, licenses: availableLicenses });
            return true;
        } else {
            await purchaseLicenseDao.addLicenseCount({ corporateId, licenses });
            return true;
        }
        return null;
    } catch (error) {
        logger.warn(error);
        return null;
    }
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
    let licenseObj = [], randomLicenseId = [];
    try {

        const userExists = await checkIfExists({ _id: corporateId, role, isActive: true });

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
            let purchaseLicenseDetails = await Promise.all(licenseList.map(async (license) => {
                let selectedLicense = purchaseLicenses.find(purchase => purchase.type === license.type);
                const randomId = await appUtils.generateNumberNanoId(selectedLicense.quantity);
                licenseObj.push({
                    _id: mongoose.Types.ObjectId(license._id),
                    count: selectedLicense.quantity,
                    randomLicenseId: randomId,
                })
                // await purchaseLicenseDao.addAvailableLicenseCount({ corporateId, licenseObj });
                randomLicenseId = [...randomLicenseId, ...randomId]
                return {
                    quantity: selectedLicense.quantity,
                    licenseId: license._id,
                    totalPrice: selectedLicense.quantity * license.price
                }
            }));
            let licenseCount = await updateLicenseCount(corporateId, licenseObj);
            let finalData = {
                corporateId,
                orderId,
                purchasedLicenses: purchaseLicenseDetails,
                paypalDetails,
                randomLicenseId
            }
            if (licenseCount) {
                let result = await purchaseLicenseDao.purchaseLicenseAdd(finalData);
                if (result) {
                    let mailTemplate = await mailHandler.getMailTemplate("CORPORATE_LICENSE_PURCHASE");
                    let Intro = `${mailTemplate.description}`
                    const html = mailHandler.mailGenHTML({
                        name: userExists.firstName + " " + userExists.lastName,
                        intro: Intro
                    });

                    // send mail
                    mailHandler.sendMail({
                        to: userExists.email,
                        subject: mailTemplate.subject,
                        html
                    });
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

exports.activatePurchaseLicense = async ({ _id, isActive }) => {
    try {
        let purchasedLicenses = await purchaseLicenseDao.getPurchaseLicense(_id);
        let corporateId = purchasedLicenses._doc.corporateId;
        let c = purchasedLicenses.isActive ? -1 : 1;
        let { randomLicenseId } = purchasedLicenses;
        let employeeRandomLicenseId = await purchaseLicenseDao.getEmployeeByRandomId(randomLicenseId);
        let assignedIds = employeeRandomLicenseId.map(i => i.randomLicenseId);
        let unassignedIds = randomLicenseId.filter(i => assignedIds.indexOf(i) === -1);
        let availableLicCount = await purchaseLicenseDao.getLicenseCount({ corporateId: corporateId });
        availableLicCount = [...availableLicCount._doc.licenses];
        for (let i = 0; i < availableLicCount.length; i++) {
            let tempIds = availableLicCount[i].randomLicenseId;
            for (let j = 0; j < tempIds.length; j++) {
                if (unassignedIds.indexOf(tempIds[j]) != -1) {
                    availableLicCount[i].count += c;
                }
            }
        }
        await purchaseLicenseDao.updateAvailableLicenseCount({ corporateId: purchasedLicenses.corporateId, licenses: availableLicCount });
        await purchaseLicenseDao.activatePurchaseLicense(_id, !purchasedLicenses.isActive);
        return { responseCode: 200 }
    } catch (error) {
        logger.warn(error);
        return { responseCode: 500 }
    }
}