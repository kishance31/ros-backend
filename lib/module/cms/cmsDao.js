
const mongoose = require("mongoose");
const AboutUs = require('../../model/aboutUsModel');
const ContactUs = require('../../model/contactUsModel');
const BaseDao = require('../../dao/baseDao');
const aboutUsDao = new BaseDao(AboutUs);
const contactUsDao = new BaseDao(ContactUs);
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);

const checkAdmin = async (adminId) => {
    try {
        return await adminDao.findOne({ _id: adminId, role: "ADMIN", isActive: true });
    } catch (error) {
        return null;
    }
}

async function addAboutUs(data) {
    try {
        return await aboutUsDao.findOneAndUpdate({}, data, { upsert: true, returnNewDocument: true, returnOriginal: false });
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};

async function aboutUsList() {
    return await aboutUsDao.findOne();
}

async function saveContactUs(data) {
    try {
        return await contactUsDao.findOneAndUpdate({}, data, { upsert: true, returnNewDocument: true, returnOriginal: false });
    } catch (error) {
        throw new Error(error.message);
    }
};

async function contactUsList() {
    return await contactUsDao.findOne();
}

const checkExist = async () => {
    try {
        return await aboutUsDao.find();
    } catch (error) {
        return null;
    }
}

const checkContactExist = async () => {
    try {
        return await contactUsDao.find();
    } catch (error) {
        return null;
    }
}

module.exports = {
    addAboutUs,
    aboutUsList,
    checkAdmin,
    checkExist,
    checkContactExist,
    saveContactUs,
    contactUsList
};
