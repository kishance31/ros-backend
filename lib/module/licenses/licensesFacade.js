"use strict";

const licensesService = require('./licensesService');

exports.addLicense = async (data) => {
    try {
        return await licensesService.addLicenseType(data);
    } catch (error) {
        return error;        
    }
}

exports.getLicenseList = async () => {
    try {
        return await licensesService.getAllLicense();
    } catch (error) {
        return error;        
    }
}

exports.corporateLicenseList = async () => {
    try {
        return await licensesService.corporateLicenseList();
    } catch (error) {
        return error;        
    }
}

exports.getLicensesByTypes = async (data) => {
    try {
        return await licensesService.getLicensesByTypes(data);
    } catch (error) {
        return error;        
    }
}

exports.getTotalLicenseCount = async (data) => {
    try {
        return await licensesService.getTotalLicenseCount(data);
    } catch (error) {
        return error;
    }
}

exports.decrementLicenseCount = async (data) => {
    try {
        return await licensesService.decrementLicenseCount(data);
    } catch (error) {
        return error;
    }
}

exports.activateLicense = async (...args) => {
    try {
        return await licensesService.activateLicense(...args)
    } catch (error) {
        return error
    }
}

exports.deactivateLicense = async (...args) => {
    try {
        return await licensesService.deactivateLicense(...args)
    } catch (error) {
        return error
    }
}

exports.editLicense = async (...args) => {
    try {
        return await licensesService.editLicense(...args)
    } catch (error) {
        return error
    }
}