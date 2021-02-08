const mongoose = require("mongoose");
const AboutUs = require('../../model/aboutUsModel');
const ContactUs = require('../../model/contactUsModel');
const BaseDao = require('../../dao/baseDao');
const aboutUsDao = new BaseDao(AboutUs);
const contactUsDao = new BaseDao(ContactUs);
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);
const ContactUsQueryModel = require('../../model/contactUsQueryModel');
const ContactUsQueryDao = new BaseDao(ContactUsQueryModel);
const FAQSModel = require('../../model/FAQSModel');
const FAQDao = new BaseDao(FAQSModel);
const newsLetterModel = require('../../model/newsLetterModel');
const newsLetterDao = new BaseDao(newsLetterModel);
const SocialMediaLinkModel = require('../../model/socialMediaLinkModel')
const socialMediaLinkDao = new BaseDao(SocialMediaLinkModel);

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

const saveContactUsQuery = async (data) => {
    try {
        let contactUsQuery = new ContactUsQueryModel(data);
        return await ContactUsQueryDao.save(contactUsQuery);
    } catch (error) {
        return error;
    }
}

const getContactUsQuery = async (batch, limit) => {
    try {
        return await ContactUsQueryDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: {} },
                        { $sort: { createdAt: -1 } },
                        { $skip: batch * limit },
                        { $limit: limit }
                    ],
                    total: [
                        { $match: {} },
                        { "$count": "count" }
                    ],
                }
            }

        ])
    } catch (err) {
        return err;
    }
}

async function updateContactUsQuery(id, data) {
    try {
        return await ContactUsQueryDao.findOneAndUpdate(
            { _id: id },
            data,
            { upsert: false, returnNewDocument: true, returnOriginal: false }
        );
    } catch (error) {
        throw new Error(error.message);
    }
};

async function saveFAQS(data) {
    try {
        let faqs = new FAQSModel(data);
        return await FAQDao.save(faqs);
    } catch (error) {
        return error;
    }
};

const getFAQS = async (batch, limit) => {
    try {
        return await FAQDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: {} },
                        { $sort: { createdAt: -1 } },
                        // { $skip: batch * limit },
                        // { $limit: limit }
                    ],
                    total: [
                        { $match: {} },
                        { "$count": "count" }
                    ],
                }
            }

        ])
    } catch (err) {
        return err;
    }
}

async function updateFAQS(id, data) {
    try {
        return await FAQDao.findOneAndUpdate(
            { _id: id },
            data,
            { upsert: false, returnNewDocument: true, returnOriginal: false }
        );
    } catch (error) {
        throw new Error(error.message);
    }
};

async function deleteFAQS(id) {
    try {
        return await FAQDao.remove({ _id: id });
    } catch (error) {
        throw new Error(error.message);
    }
};

const saveNewsLetter = async (data) => {
    try {
        let newsLetter = new newsLetterModel(data);
        return await newsLetterDao.save(newsLetter);
    } catch (error) {
        return error;
    }
}

const getNewsLetter = async (batch, limit) => {
    try {
        return await newsLetterDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: {} },
                        { $sort: { createdAt: -1 } },
                        { $skip: batch * limit },
                        { $limit: limit }
                    ],
                    total: [
                        { $match: {} },
                        { "$count": "count" }
                    ],
                }
            }

        ])
    } catch (err) {
        return err;
    }
}

async function updateNewsLetter(id, data) {
    try {
        return await newsLetterDao.findOneAndUpdate(
            { _id: id },
            data,
            { upsert: false, returnNewDocument: true, returnOriginal: false }
        );
    } catch (error) {
        throw new Error(error.message);
    }
};

async function saveSocialLink(data) {
    try {
        return await SocialMediaLinkModel.findOneAndUpdate({}, data, { upsert: true, returnNewDocument: true, returnOriginal: false });
    } catch (error) {
        return error;
    }
}

const getSocialMediaLinks = async () => {
    try {
        return await SocialMediaLinkModel.findOne({});
    } catch (error) {
        return error;
    }
}

module.exports = {
    addAboutUs,
    aboutUsList,
    checkAdmin,
    checkExist,
    checkContactExist,
    saveContactUs,
    contactUsList,
    saveContactUsQuery,
    getContactUsQuery,
    updateContactUsQuery,
    saveFAQS,
    getFAQS,
    updateFAQS,
    deleteFAQS,
    saveNewsLetter,
    updateNewsLetter,
    getNewsLetter,
    saveSocialLink,
    getSocialMediaLinks
};