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

exports.getLicensesByTypes = async (data) => {
    try {
        return await licensesService.getLicensesByTypes(data);
    } catch (error) {
        return error;        
    }
}