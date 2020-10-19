const LicenseModel = require('../../model/licensesModel');
const LicenseCountModel = require('../../model/LicenseCountModel');
const UserModel = require('../../model/userModel');
const BaseDao = require('../../dao/baseDao');
const LicenseDao = new BaseDao(LicenseModel);
const LicenseCountDao = new BaseDao(LicenseCountModel);
const userDao = new BaseDao(UserModel);
const { ObjectId } = require('mongoose').Types;

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

exports.getLicensesByIds = async (ids) => {
    return await LicenseDao.find(
        {
            _id: {$in: [...ids]}
        },
        { type: 1},
    )
}

exports.getAllLicenseList = async () => {
    return await LicenseDao.find({}, { type: 1, price: 1, active: 1 });
}

exports.corporateLicenseList = async () => {
    return await LicenseDao.find({active: true}, { type: 1, price: 1, active: 1 });
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

exports.activeDeativeLicense = async (type, active) => {
    return await LicenseDao.findOneAndUpdate(
        { type },
        { $set: { active } },
    )
}

exports.decrementLicenseCount = async (corporateId, licenseId) => {
    return await LicenseCountDao.update(
        { corporateId, [licenseId]: { $gt: 0 } },
        { $inc: { [licenseId]: -1 } },
        {upsert: false},
    )
}

exports.editLicense = async (id, data) => {
    try {
        return await LicenseDao.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: { ...data } },
            { upsert: false }
        )
    } catch (error) {
        return null;
    }
}
