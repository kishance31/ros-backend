
const mongoose = require("mongoose");
const Category = require('../../model/categoryModel');
const BaseDao = new require('./../../dao/baseDao');
const categoryDao = new BaseDao(Category);

async function categoryById(_query) {
    return await categoryDao.findOne(_query);
}

async function saveCategory(categoryInfo) {
    let category = new Category(categoryInfo);
    return await categoryDao.save(category);
};

async function categoryList() {
    return await categoryDao.find();
}

async function updateCategory(data,_update) {
    try {
        let query = {};
        query._id = data._id;
        
       
        return await categoryDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function deleteCategory(data) {
    try {
        let query = {};
        query._id = data._id;

      
        return await categoryDao.remove(query);
    } catch (err) {
        return err;
    }
};



module.exports = {
    categoryById,
    saveCategory,
    categoryList,
    updateCategory,
    deleteCategory
  
};
