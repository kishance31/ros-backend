const categoryService = require('./categoryService');


// skv_adminpanal : add project
function categoryAdd(data) {
    return categoryService.categoryAdd(data).then(result => result)
    
}

function categoryDeleteById(data) {
    return categoryService.deleteCategory(data).then(data=> data)
      
}

function getCategoryList(req) {
    return categoryService.categoryList(req).then(result =>result)
}

function getCategoryById(req) {
    return categoryService.getCategoryById(req).then(result => result)
}


function updateCategoryById(req,updateData) {
    return categoryService.categoryEditById(req,updateData).then(result => 
        result)
}
function getCategoryByCorporateId(req){
    return categoryService.getcategoryByCorporateId(req).then(result => result)

}


module.exports = {
    categoryAdd,
    categoryDeleteById,
    getCategoryList,
    getCategoryById,
    updateCategoryById,
    getCategoryByCorporateId
}