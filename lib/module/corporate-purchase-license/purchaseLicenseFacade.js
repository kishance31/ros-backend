'use strict';

const promise = require("bluebird");
const jwtHandler = require('../../commonHandler/jwtHandler');
const AppUtil   = require('../../appUtils');
const purchaseLicenseService = require('./purchaseLicenseService');
const purchaseLicenseMapper = require('./purchaseLicenseMapper');

exports.createLicenseOrderId = async (data) => {
    try {
        return await purchaseLicenseService.generateOrderId(data)
    } catch (error) {
        return error;
    }
}

exports.purchaseLicense = async (data) => {
    try {
        return await purchaseLicenseService.purchaseLicense(data);
    } catch (error) {
        return error;
    }
}

exports.getPurchasedLicenses = async(data) => {
    try {
        return await purchaseLicenseService.getPurchasedLicenses(data);
    } catch (error) {
        return error;
    }
}
exports.getAllPurchasedLicenses = async(data) => {
    try {
        return await purchaseLicenseService.getAllPurchasedLicenses(data);
    } catch (error) {
        return error;
    }
}

exports.activatePurchaseLicense = async (data) => {
    try {
        return await purchaseLicenseService.activatePurchaseLicense(data);
    } catch (error) {
        return error;
    }
}