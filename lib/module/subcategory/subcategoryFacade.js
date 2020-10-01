const subCategoryService = require('./subcategoryService');


// skv_adminpanal : add project
function subCategoryAdd(data, userId) {
    return subCategoryService.subcategoryAdd(data, userId).then(result => result)
    
}

function subCategoryDeleteById(data) {
    return subCategoryService.deleteSubCategory(data).then(data=> data)
      
}

function getSubCategoryList(req) {
    return subCategoryService.subcategoryList(req).then(result =>result)
}

function getSubCategoryById(req) {
    return subCategoryService.getSubCategoryById(req).then(result => result)
}


function updateSubCategoryById(req,updateData) {
    return subCategoryService.subcategoryEditById(req,updateData).then(result => 
        result)
}
function getSubCategoryByCategoryId(req){
    return subCategoryService.getSubCategoryByCategoryId(req).then(result => result)

}
function updateSubCategoryStatusById(req,updateData) {
    return subCategoryService.subcategoryEditStatusById(req,updateData).then(result => 
        result)
}

module.exports = {
    subCategoryAdd,
    subCategoryDeleteById,
    getSubCategoryList,
    getSubCategoryById,
    updateSubCategoryById,
    getSubCategoryByCategoryId,
    updateSubCategoryStatusById
}