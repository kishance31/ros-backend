const branchService = require('./branchService');
const branchMapper = require('./branchMapper');
const branchDao = require('./branchDao');
const Branch = require('../../model/branchModel');

// skv_adminpanal : add project
function branchAdd(data) {
    return branchService.branchAdd(data).then(result => result)
    
}

function branchDeleteById(data) {
    return branchService.deleteBranch(data).then(data=> data)
      
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


module.exports = {
    branchAdd,
    branchDeleteById,
    getBranchList,
    getBranchById,
    updateBranchById
}