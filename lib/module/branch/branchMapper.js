
function responseMapping(code, msg) {
    return {
        responseCode: code,
        responseMessage: msg
    }
}

function responseMappingData(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        data: data
    }
}
function responseMappingBranches(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        branchList: data.length ? data[0].list : [],
        totalBranches: data.length && data[0].total.length ? data[0].total[0].count : 0
    }
}
module.exports = {

    responseMapping,
    responseMappingData,
    responseMappingBranches

};
