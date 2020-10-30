const cmsService = require('./cmsService');


function addAboutUs(data, userId) {
    return cmsService.addAboutUs(data, userId).then(result => result)

}


function getAboutUsList(req) {
    return cmsService.aboutUsList(req).then(result => result)
}

function updateAboutUs(updateData, image) {
    return cmsService.updateAboutUs(updateData, image).then(result =>
        result)
}

//contact-us

function addContactUs(data, userId) {
    return cmsService.addContactUs(data, userId).then(result => result)

}

function getContactUsList(req) {
    return cmsService.contactUsList(req).then(result => result)
}

function updateContactUs(updateData) {
    return cmsService.updateContactUs(updateData).then(result =>
        result)
}

function saveContactUsQuery(data) {
    return cmsService.saveContactUsQuery(data).then(result =>
        result)
}

function getContactUsQuery(...args) {
    return cmsService.getContactUsQuery(...args).then(result =>
        result)
}


function updateContactUsQuery(...args) {
    return cmsService.updateContactUsQuery(...args).then(result =>
        result)
}

function saveFAQS(data) {
    return cmsService.saveFAQS(data).then(result =>
        result)
}

function getFAQS(...args) {
    return cmsService.getFAQS(...args).then(result =>
        result)
}


function updateFAQS(...args) {
    return cmsService.updateFAQS(...args).then(result =>
        result)
}

function deleteFAQS(...args) {
    return cmsService.deleteFAQS(...args).then(result =>
        result)
}

function saveNewsLetter(data) {
    return cmsService.saveNewsLetter(data).then(result =>
        result)
}

function getNewsLetter(...args) {
    return cmsService.getNewsLetter(...args).then(result =>
        result)
}


function updateNewsLetter(...args) {
    return cmsService.updateNewsLetter(...args).then(result =>
        result)
}

module.exports = {
    addAboutUs,
    getAboutUsList,
    updateAboutUs,
    getContactUsList,
    addContactUs,
    updateContactUs,
    saveContactUsQuery,
    getContactUsQuery,
    updateContactUsQuery,
    saveFAQS,
    getFAQS,
    updateFAQS,
    deleteFAQS,
    saveNewsLetter,
    updateNewsLetter,
    getNewsLetter,
}