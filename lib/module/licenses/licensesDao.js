const LicenseModel = require('../../model/licensesModel');
const BaseDao = require('../../dao/baseDao');
const LicenseDao = new BaseDao(LicenseModel);

exports.checkIfExists = async ({ type }) => {
    const query = { type };
    return await LicenseDao.findOne(query);
}

exports.addLicense = async (data) => {
    const license = new LicenseModel(data);
    return await LicenseDao.save(license);
}

exports.getAllLicenseList = async () => {
    return await LicenseDao.find({}, {type: 1, price: 1});
}

exports.getLicensesByTypes = async (typesArr) => {
    logger.info(typesArr)
    return await LicenseDao.find({type: {$in: [...typesArr]}});
}