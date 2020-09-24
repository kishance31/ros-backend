
const mongoose = require("mongoose");
const SubCategory = require('../../model/subCategoryModel');
const BaseDao = new require('./../../dao/baseDao');
const subCategoryDao = new BaseDao(SubCategory);

async function subcategoryById(_query) {
    return await subCategoryDao.findOne(_query);
}

async function getSubCategoryByCategoryId(_query) {
    return await subCategoryDao.findOne(_query);

}
async function saveSubCategory(subCategoryInfo) {
    let subCategory = new SubCategory(subCategoryInfo);
    return await subCategoryDao.save(subCategory);
};

async function subCategoryList() {
    return await subCategoryDao.find();
}

async function updateSubCategory(data,_update) {
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

async function updateSubCategoryStatus(data,_update) {
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
    updateSubCategoryStatus
  
};
