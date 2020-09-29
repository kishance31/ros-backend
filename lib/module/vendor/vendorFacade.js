const vendorService = require('./vendorService');


// skv_adminpanal : add project
function vendorAdd(data) {
    return vendorService.vendorAdd(data).then(result => result)
    
}

function vendorDeleteById(data) {
    return vendorService.deleteVendor(data).then(data=> data)
      
}

function getVendorList(req) {
    return vendorService.vendorList(req).then(result =>result)
}

function getVendorById(req) {
    return vendorService.getVendorById(req).then(result => result)
}


function updateVendorById(req,updateData) {
    return vendorService.vendorEditById(req,updateData).then(result => 
        result)
}
function updateVendorStatusById(req,updateData) {
    return vendorService.vendorStatusEditById(req,updateData).then(result => 
        result)
}


module.exports = {
    vendorAdd,
    vendorDeleteById,
    getVendorList,
    getVendorById,
    updateVendorById,
    updateVendorStatusById
}