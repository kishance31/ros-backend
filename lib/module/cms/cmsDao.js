
const mongoose = require("mongoose");
const Cms = require('../../model/cmsModel');
const BaseDao = require('../../dao/baseDao');
const cmsDao = new BaseDao(Cms);
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);

const checkAdmin = async (adminId) => {
    try {
        return await adminDao.findOne({ _id: adminId, role: "ADMIN", isActive: true });
    } catch (error) {
        return null;
    }
}

async function cmsById(_query) {
    return await cmsDao.findOne(_query);
}

async function saveCms(data) {
    try {
        let cms = new Cms(data);
        return await cmsDao.save(cms);
    } catch (error) {
        throw new Error(error.message);
    }
};

async function cmsList() {
    return await cmsDao.find();
}


async function updateCms(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await cmsDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};


async function deleteCms(data) {
    try {
        let query = {};
        query._id = data._id;


        return await cmsDao.remove(query);
    } catch (err) {
        return err;
    }
};



module.exports = {
    cmsById,
    saveCms,
    cmsList,
    updateCms,
    deleteCms,
    checkAdmin
};
