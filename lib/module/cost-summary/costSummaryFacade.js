const costSummaryService = require('./costSummaryService');


function costSummaryAdd(data, userId) {
    return costSummaryService.costSummaryAdd(data, userId).then(result => result)
    
}


function getCostSummaryList(req) {
    return costSummaryService.costSummaryList(req).then(result =>result)
}

function getCostSummaryById() {
    return costSummaryService.getCostSummaryById().then(result => result)
}


function updateCostSummaryById(req,updateData) {
    return costSummaryService.costSummaryEditById(req,updateData).then(result => 
        result)
}


module.exports = {
    costSummaryAdd,
    getCostSummaryList,
    getCostSummaryById,
    updateCostSummaryById,
}