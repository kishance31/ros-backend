'use strict';

const _ = require("lodash");
const licenseDao = require('./licensesDao');
const licenseMapper = require('./licensesMapper');

// create license type
exports.addLicenseType = async (licenseDetails) => {
    const {
        type,
    } = licenseDetails;
    try {
        const licenseExists = await licenseDao.checkIfExists({type});
        if(licenseExists) {
            return licenseMapper.licenseExists(type);
        }
        const data = await licenseDao.addLicense(licenseDetails);
        if(data) {
            return licenseMapper.licenseCreateSuccess(type);
        }
    } catch (error) {
        return error;
    }
}

exports.getAllLicense = async () => {
    try {
        const data = await licenseDao.getAllLicenseList();
        if(data) {
            return licenseMapper.licenseList(data)
        }
        return licenseMapper.licenseList([]);
    } catch (error) {
        return error;        
    }
}

exports.getLicensesByTypes = async (data) => {
    try {
        const types = await licenseDao.getLicensesByTypes(data);
        if(types) {
            return licenseMapper.licenseList(types)
        }
        return licenseMapper.licenseList([]);
    } catch (error) {
        return error;        
    }
}