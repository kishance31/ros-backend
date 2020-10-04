const cmsService = require('./cmsService');


function cmsAdd(data, userId) {
    return cmsService.cmsAdd(data, userId).then(result => result)
    
}

function cmsDeleteById(data) {
    return cmsService.deleteCms(data).then(data=> data)
      
}

function getCmsList(req) {
    return cmsService.cmsList(req).then(result =>result)
}


function getCmsById(req) {
    return cmsService.getCmsById(req).then(result => result)
}

function updateCmsById(req,updateData) {
    return cmsService.cmsEditById(req,updateData).then(result => 
        result)
}

module.exports = {
    cmsAdd,
    cmsDeleteById,
    getCmsList,
    getCmsById,
    updateCmsById
}