'use strict';


const categoryDao = require('./categoryDao');
const categoryMapper = require('./categoryMapper');
const categoryConstants = require("./categoryConstants");

function categoryAdd(categoryDetails) {
    logger.debug(`Inside categoryservices`);
    try {

        return categoryDao.saveCategory(categoryDetails).then((data) => {

            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_Added, data)


        }).catch((err) => {

            console.log({ err })
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGES.internalServerError)
        })

    } catch (err) {
        return err;
    }
};


function categoryList() {
    try {
        return categoryDao.categoryList().then((data) => {
            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getCategoryById(id) {
    try {
        return categoryDao.categoryById(id).then((data) => {
            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_By_Id, data)

        }).catch((err) => {
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}
function categoryEditById(id, data) {
    try {
        return  categoryDao.updateCategory(id, data).then((data) => {
            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_Update, data)

        }).catch((err)=>{
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteCategory(id) {
    try {
        return categoryDao.deleteCategory(id).then((data) => {
            return categoryMapper.responseMapping(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_Deleted)

        }).catch((err)=>{
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function getCategoryByCorporateId(id){
    try {
        return categoryDao.categoryByCorporateId(id).then((data) => {
            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_By_Corporate, data)

        }).catch((err) => {
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }
}
module.exports = {
    categoryAdd,
    categoryList,
    getCategoryById,
    categoryEditById,
    deleteCategory,
    getCategoryByCorporateId

};