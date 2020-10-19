'use strict';

const mongoose = require('mongoose')
const _ = require("lodash");
const licenseDao = require('./licensesDao');
const licenseMapper = require('./licensesMapper');
const licenseConstants = require('./licensesConstant');

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

exports.corporateLicenseList = async () => {
    try {
        const data = await licenseDao.corporateLicenseList();
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

exports.getTotalLicenseCount = async (data) => {
    try {
        const {
            corporateId, userId, role
        } = data;
        
        if(corporateId !== userId) {
            return licenseMapper.generateTokenInvalidError();
        }

        const userExists = await licenseDao.checkIfUserExists({ _id: corporateId, role });
        if(!userExists) {
            return licenseMapper.invalidUserError();
        }

        let result = await licenseDao.getTotalLicenseCount(corporateId);
        if(result) {
            let ids = Object.keys(result._doc).map(key => mongoose.Types.ObjectId(key));
            let licensesNames = await licenseDao.getLicensesByIds(ids)
            let finalResult = {};
            licensesNames.forEach((license, idx) => {
                finalResult[license.type] = result._doc[license._id]
            })
            return licenseMapper.availabelLicenseCount(finalResult);
        }
        if(result === null) {
            return licenseMapper.availabelLicenseCount({});
        }

        return licenseMapper.availabelLicenseCountError();
    } catch (error) {
        console.log(error)
        return error;
    }
}

exports.decrementLicenseCount = async (data, checkUser) => {
    try {
        const {
            corporateId, licenseId, userId, role
        } = data;

        if(checkUser) {
            if(corporateId !== userId) {
                return licenseMapper.generateTokenInvalidError();
            }
    
            const userExists = await licenseDao.checkIfUserExists({ _id: corporateId, role });
            if(!userExists) {
                return licenseMapper.invalidUserError();
            }
        }

        let result = await licenseDao.decrementLicenseCount(corporateId, licenseId);
        logger.info(result)
        if(result.ok) {
            if(result.nModified) {
                return licenseMapper.decrementLicenseCount();
            } else {
                return licenseMapper.decrementLicenseCountZero();
            }
        }

        return licenseMapper.decrementLicenseCountError();
    } catch (error) {
        return error;
    }
}

exports.activateLicense = async (type, userId, role) => {
    try {
        const userExists = await licenseDao.checkIfUserExists({ _id: userId, role });
        if(!userExists) {
            return licenseMapper.invalidUserError();
        }

        let result = await licenseDao.activeDeativeLicense(type, true);
        if(result) {
            return licenseMapper.responseMapping(200, licenseConstants.MESSAGES.licenseActivateSuccess);
        }
        return licenseMapper.responseMapping(400, licenseConstants.MESSAGES.licenseActivateError);
    } catch (error) {
        return licenseMapper.responseMapping(400, licenseConstants.MESSAGES.licenseActivateError);
    }
}

exports.deactivateLicense = async (type, userId, role) => {
    try {
        const userExists = await licenseDao.checkIfUserExists({ _id: userId, role });
        if(!userExists) {
            return licenseMapper.invalidUserError();
        }

        let result = await licenseDao.activeDeativeLicense(type, false);
        if(result) {
            return licenseMapper.responseMapping(200, licenseConstants.MESSAGES.licenseDeactivateSuccess);
        }
        return licenseMapper.responseMapping(400, licenseConstants.MESSAGES.licenseDeactivateError);
    } catch (error) {
        return licenseMapper.responseMapping(400, licenseConstants.MESSAGES.licenseDeactivateError);
    }
}

exports.editLicense = async (id, licenseData, adminData) => {
    try {
        const userExists = await licenseDao.checkIfUserExists({ _id: adminData.userId, role: adminData.role });
        if(!userExists) {
            return licenseMapper.invalidUserError();
        }

        let result = await licenseDao.editLicense(id, licenseData);
        if(result) {
            return licenseMapper.responseMapping(200, licenseConstants.MESSAGES.licenseEditSuccess);
        }
        return licenseMapper.responseMapping(400, licenseConstants.MESSAGES.licenseEditError);
    } catch (error) {
        return licenseMapper.responseMapping(400, licenseConstants.MESSAGES.licenseEditError);
    }
}