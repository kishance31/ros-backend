
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
async function updateAboutUs(id, _update) {
    try {
        let query = {};
        query._id = id ;
        

        return await aboutUsDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};
async function saveContactUs(data) {
    try {
        let contactUs = new ContactUs(data);
        return await contactUsDao.save(contactUs);
    } catch (error) {
        throw new Error(error.message);
    }
};

async function updateContactUs(id, _update) {
    try {
        let query = {};
        query._id = id;


        return await contactUsDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};
async function contactUsList() {
    return await contactUsDao.find();
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
    updateAboutUs,
    aboutUsList,
    checkAdmin,
    checkExist,
    checkContactExist,
    saveContactUs,
    updateContactUs,
    contactUsList

};
