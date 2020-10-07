
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
        let aboutUs = new AboutUs(data);
        return await aboutUsDao.save(aboutUs);
    } catch (error) {
        throw new Error(error.message);
    }
};

async function aboutUsList() {
    return await aboutUsDao.find();
}

async function aboutUsById(_query) {
    return await aboutUsDao.findOne(_query);
}

async function updateAboutUs(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await aboutUsDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};


async function deleteAboutUs(data) {
    try {
        let query = {};
        query._id = data._id;


        return await aboutUsDao.remove(query);
    } catch (err) {
        return err;
    }
}

async function saveContactUs(data) {
    try {
        let contactUs = new ContactUs(data);
        return await contactUsDao.save(contactUs);
    } catch (error) {
        throw new Error(error.message);
    }
};

async function contactUsList() {
    return await contactUsDao.find();
}

async function contactUsById(_query) {
    return await contactUsDao.findOne(_query);
}

async function updateContactUs(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await contactUsDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};


async function deleteContactUs(data) {
    try {
        let query = {};
        query._id = data._id;


        return await contactUsDao.remove(query);
    } catch (err) {
        return err;
    }
};



module.exports = {
    aboutUsById,
    addAboutUs,
    aboutUsList,
    updateAboutUs,
    deleteAboutUs,
    checkAdmin,
    saveContactUs,
    contactUsList,
    contactUsById,
    updateContactUs,
    deleteContactUs

};