const categoryService = require('./categoryService');


// skv_adminpanal : add project
function categoryAdd(data, userId) {
    return categoryService.categoryAdd(data, userId).then(result => result)
    
}

function categoryDeleteById(data) {
    return categoryService.deleteCategory(data).then(data=> data)
      
}

function getCategoryList(req) {
    return categoryService.categoryList(req).then(result =>result)
}

function getCategoryWithSubCategory(req) {
    return categoryService.getCategoryWithSubCategory(req).then(result =>result)
}

function getCategoryById(req) {
    return categoryService.getCategoryById(req).then(result => result)
}


function updateCategoryById(req,updateData) {
    return categoryService.categoryEditById(req,updateData).then(result => 
        result)
}
function updateCategoryStatusById(req,status) {
    return categoryService.categoryStatusEditById(req,status).then(result => 
        result)
}


module.exports = {
    categoryAdd,
    categoryDeleteById,
    getCategoryList,
    getCategoryById,
    updateCategoryById,
    updateCategoryStatusById,
    getCategoryWithSubCategory
}