const branchService = require('./branchService');


// skv_adminpanal : add project
function branchAdd(data) {
    return branchService.branchAdd(data).then(result => result)
    
}

function branchDeleteById(data, userId) {
    return branchService.deleteBranch(data, userId).then(data=> data)
      
}

function getBranchList(req) {
    return branchService.branchList(req).then(result =>result)
}

function getBranchById(req) {
    return branchService.getBranchById(req).then(result => result)
}


function updateBranchById(req,updateData) {
    return branchService.branchEditById(req,updateData).then(result => 
        result)
}
function getBranchByCorporateId(req, batch, limit){
    return branchService.getBranchByCorporateId(req, batch, limit).then(result => result)

}

function getCorporateBranchNames(corporate_admin_id) {
    return branchService.getCorporateBranchNames(corporate_admin_id).then(result => result);
}


module.exports = {
    branchAdd,
    branchDeleteById,
    getBranchList,
    getBranchById,
    updateBranchById,
    getBranchByCorporateId,
    getCorporateBranchNames,
}