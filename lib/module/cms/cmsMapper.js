
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

function responseMappingList(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        list: data.length ? data[0].list : [],
        totalProducts: data.length && data[0].total.length ? data[0].total[0].count : 0
    }
}

module.exports = {

    responseMapping,
    responseMappingData,
    responseMappingList

};
