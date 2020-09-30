
const mongoose = require("mongoose");
const SubCategory = require('../../model/subCategoryModel');
const BaseDao = require('../../dao/baseDao');
const subCategoryDao = new BaseDao(SubCategory);
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);
const categoryModel = require('../../model/categoryModel');
const categoryDao = new BaseDao(categoryModel);

const checkAdmin = async (adminId) => {
    try {
        return await adminDao.findOne({ _id: adminId, role: "ADMIN", isActive: true });
    } catch (error) {
        return null;
    }
}

async function subcategoryById(_query) {
    return await subCategoryDao.findOne(_query);
}

async function getSubCategoryByCategoryId(_query) {
    return await subCategoryDao.findOne(_query);
}

async function saveSubCategory(subCategoryInfo) {
    try {
        let subCategory = new SubCategory(subCategoryInfo);
        return await subCategoryDao.save(subCategory);
    } catch (error) {
        throw new Error(error.message);
    }
};

function updateSubCategoryIdInCategory(categoryId, subCategoryId) {
    try {
        categoryDao.findOneAndUpdate(
            { _id: categoryId },
            { $addToSet: { subCategories: subCategoryId } },
            { upsert: true },
        )
    } catch (error) {
        logger.warn(error);
    }
}

async function subCategoryList() {
    return await subCategoryDao.find();
}

async function updateSubCategory(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await subCategoryDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function deleteSubCategory(data) {
    try {
        let query = {};
        query._id = data._id;


        return await subCategoryDao.remove(query);
    } catch (err) {
        return err;
    }
};

async function updateSubCategoryStatus(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await subCategoryDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

module.exports = {
    getSubCategoryByCategoryId,
    subcategoryById,
    saveSubCategory,
    subCategoryList,
    updateSubCategory,
    deleteSubCategory,
    updateSubCategoryStatus,
    checkAdmin,
    updateSubCategoryIdInCategory
};
