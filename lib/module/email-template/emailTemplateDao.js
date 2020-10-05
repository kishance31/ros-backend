
const mongoose = require("mongoose");
const EmailTemplate = require('../../model/emailTemplateModel');
const BaseDao = require('../../dao/baseDao');
const emailTemplateDao = new BaseDao(EmailTemplate);
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);

const checkAdmin = async (adminId) => {
    try {
        return await adminDao.findOne({ _id: adminId, role: "ADMIN", isActive: true });
    } catch (error) {
        return null;
    }
}

async function emailTemplateById(_query) {
    return await emailTemplateDao.findOne(_query);
}

async function saveEmailTemplate(data) {
    try {
        let emailTemplate = new EmailTemplate(data);
        return await emailTemplateDao.save(emailTemplate);
    } catch (error) {
        throw new Error(error.message);
    }
};

async function emailTemplateList() {
    return await emailTemplateDao.find();
}


async function updateEmailTemplate(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await emailTemplateDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};


async function deleteEmailTemplate(data) {
    try {
        let query = {};
        query._id = data._id;


        return await emailTemplateDao.remove(query);
    } catch (err) {
        return err;
    }
};



module.exports = {
    emailTemplateById,
    saveEmailTemplate,
    emailTemplateList,
    updateEmailTemplate,
    deleteEmailTemplate,
    checkAdmin
};
