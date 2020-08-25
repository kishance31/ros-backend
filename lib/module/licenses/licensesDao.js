const LicenseModel = require('../../model/licensesModel');
const LicenseCountModel = require('../../model/LicenseCountModel');
const UserModel = require('../../model/userModel');
const BaseDao = require('../../dao/baseDao');
const LicenseDao = new BaseDao(LicenseModel);
const LicenseCountDao = new BaseDao(LicenseCountModel);
const userDao = new BaseDao(UserModel);

exports.checkIfExists = async ({ type }) => {
    return await LicenseDao.findOne({ type });
}

exports.checkIfUserExists = async (query) => {
    return await userDao.findOne(query);
}

exports.addLicense = async (data) => {
    const license = new LicenseModel(data);
    return await LicenseDao.save(license);
}

exports.getAllLicenseList = async () => {
    return await LicenseDao.find({}, { type: 1, price: 1 });
}

exports.getLicensesByTypes = async (typesArr) => {
    return await LicenseDao.find({ type: { $in: [...typesArr] } });
}

exports.getTotalLicenseCount = async (corporateId) => {
    return await LicenseCountDao.findOne(
        { corporateId },
        { corporateId: 0, _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    );
}

exports.decrementLicenseCount = async (corporateId, licenseType) => {
    return await LicenseCountDao.update(
        { corporateId, [licenseType]: { $gt: 0 } },
        { $inc: { [licenseType]: -1 } }
    )
}