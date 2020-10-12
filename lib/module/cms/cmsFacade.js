const cmsService = require('./cmsService');


function addAboutUs(data, userId) {
    return cmsService.addAboutUs(data, userId).then(result => result)
    
}


function getAboutUsList(req) {
    return cmsService.aboutUsList(req).then(result =>result)
}

function updateAboutUs(updateData,image) {
    return cmsService.updateAboutUs(updateData,image).then(result => 
        result)
}

//contact-us

function addContactUs(data, userId) {
    return cmsService.addContactUs(data, userId).then(result => result)
    
}

function getContactUsList(req) {
    return cmsService.contactUsList(req).then(result =>result)
}


function updateContactUs(updateData) {
    return cmsService.updateContactUs(updateData).then(result => 
        result)
}
module.exports = {
    addAboutUs,
    getAboutUsList,
    updateAboutUs,
    getContactUsList,
    addContactUs,
    updateContactUs

}