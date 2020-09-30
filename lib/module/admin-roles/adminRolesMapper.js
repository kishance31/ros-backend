
function responseMapping(code, msg) {
    return {
        responseCode: code,
        responseMessage: msg
    }
}

function responseMappingData(code, msg, data) {
    console.log(data);
    return {
        responseCode: code,
        responseMessage: msg,
        data: data
    }
}

module.exports = {

    responseMapping,
    responseMappingData,

};
