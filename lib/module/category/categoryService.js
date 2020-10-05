'use strict';


const categoryDao = require('./categoryDao');
const categoryMapper = require('./categoryMapper');
const categoryConstants = require("./categoryConstants");

async function categoryAdd(category_name, adminId) {
    try {

        const adminExists = await categoryDao.checkAdmin(adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(categoryConstants.CODE.Unauthorized, categoryConstants.MESSAGES.Unauthorized);
        }
        
        return categoryDao.saveCategory(category_name).then((data) => {
            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_Added, data)
        }).catch((err) => {
            logger.warn(err);
            if(err.message.indexOf("duplicate") !== -1) {
                return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGES.CategoryNameDuplicate)    
            }
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, err.message)
        })
    } catch (err) {
        console.log(err)
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

function getCategoryWithSubCategory() {
    try {
        return categoryDao.getCategoryWithSubCategory().then((data) => {
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
        return  categoryDao.updateCategory(id, data).then((result) => {
            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_Update)
        }).catch((err)=>{
            return categoryMapper.responseMapping(categoryConstants.CODE.INTRNLSRVR, categoryConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}
function categoryStatusEditById(id, status) {
    try {
        return  categoryDao.updateCategoryStatus(id, status).then((result) => {
            return categoryMapper.responseMappingData(categoryConstants.CODE.Success, categoryConstants.MESSAGES.Category_Update)

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
    categoryStatusEditById,
    deleteCategory,
    getCategoryByCorporateId,
    getCategoryWithSubCategory
};