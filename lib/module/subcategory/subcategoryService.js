'use strict';


const subcategoryDao = require('./subcategoryDao');
const subcategoryMapper = require('./subcategoryMapper');
const subcategoryConstants = require("./subcategoryConstants");

function subcategoryAdd(subcategoryDetails) {
    logger.debug(`Inside subcategoryservices`);
    try {

        return subcategoryDao.saveSubCategory(subcategoryDetails).then((data) => {

            return subcategoryMapper.responseMappingData(subcategoryConstants.CODE.Success, subcategoryConstants.MESSAGES.SubCategory_Added, data)


        }).catch((err) => {

            console.log({ err })
            return subcategoryMapper.responseMapping(subcategoryConstants.CODE.INTRNLSRVR, subcategoryConstants.MESSAGES.internalServerError)
        })

    } catch (err) {
        return err;
    }
};


function subcategoryList() {
    try {
        return subcategoryDao.subCategoryList().then((data) => {
            return subcategoryMapper.responseMappingData(subcategoryConstants.CODE.Success, subcategoryConstants.MESSAGES.SubCategory_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return branchMapper.responseMapping(subcategoryConstants.CODE.INTRNLSRVR, subcategoryConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getSubCategoryById(id) { 
    try {
        return subcategoryDao.subcategoryById(id).then((data) => {
            return subcategoryMapper.responseMappingData(subcategoryConstants.CODE.Success, subcategoryConstants.MESSAGES.SubCategory_By_Id, data)

        }).catch((err) => {
            return subcategoryMapper.responseMapping(subcategoryConstants.CODE.INTRNLSRVR, subcategoryConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}
function subcategoryEditById(id, data) {
    try {
        return  subcategoryDao.updateSubCategory(id, data).then((data) => {
            return subcategoryMapper.responseMappingData(subcategoryConstants.CODE.Success, subcategoryConstants.MESSAGES.SubCategory_Update, data)

        }).catch((err)=>{
            return subcategoryMapper.responseMapping(subcategoryConstants.CODE.INTRNLSRVR, subcategoryConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteSubCategory(id) {
    try {
        return subcategoryDao.deleteSubCategory(id).then((data) => {
            return subcategoryMapper.responseMapping(subcategoryConstants.CODE.Success, subcategoryConstants.MESSAGES.SubCategory_Deleted)

        }).catch((err)=>{
            return subcategoryMapper.responseMapping(subcategoryConstants.CODE.INTRNLSRVR, subcategoryConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function getSubCategoryByCategoryId(id){
    try {
        return subcategoryDao.getSubCategoryByCategoryId(id).then((data) => {
            return subcategoryMapper.responseMappingData(subcategoryConstants.CODE.Success, subcategoryConstants.MESSAGES.SubCategory_By_Category, data)

        }).catch((err) => {
            return subcategoryMapper.responseMapping(subcategoryConstants.CODE.INTRNLSRVR, subcategoryConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }
}
module.exports = {
    subcategoryAdd,
    subcategoryList,
    getSubCategoryById,
    subcategoryEditById,
    deleteSubCategory,
    getSubCategoryByCategoryId

};