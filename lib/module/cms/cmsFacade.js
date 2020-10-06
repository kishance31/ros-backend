const cmsService = require('./cmsService');


function addAboutUs(data, userId) {
    return cmsService.addAboutUs(data, userId).then(result => result)
    
}

function deleteAboutUs(data) {
    return cmsService.deleteAboutUs(data).then(data=> data)
      
}

function getAboutUsList(req) {
    return cmsService.aboutUsList(req).then(result =>result)
}


function getAboutUsById(req) {
    return cmsService.getAboutUsById(req).then(result => result)
}

function updateAboutUs(req,updateData) {
    return cmsService.updateAboutUs(req,updateData).then(result => 
        result)
}

//contact-us

function addContactUs(data, userId) {
    return cmsService.addContactUs(data, userId).then(result => result)
    
}

function deleteContactUs(data) {
    return cmsService.deleteContactUs(data).then(data=> data)
      
}

function getContactUsList(req) {
    return cmsService.contactUsList(req).then(result =>result)
}


function getContactUsById(req) {
    return cmsService.getContactUsById(req).then(result => result)
}

function updateContactUs(req,updateData) {
    return cmsService.updateContactUs(req,updateData).then(result => 
        result)
}
module.exports = {
    addAboutUs,
    deleteAboutUs,
    getAboutUsList,
    getAboutUsById,
    updateAboutUs,
    addContactUs,
    deleteContactUs,
    getContactUsList,
    getContactUsById,
    updateContactUs

}