
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
        totalCount: data.length && data[0].total.length ? data[0].total[0].count : 0
    }
}

function responseMappingCount(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        data: typeof data === "object" && data.length ? data[0].total : 0
    }
}

function monthNumberToName(data) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    console.log(data);
    let finalData = {
        labels: [],
        data: []
    }
    if(data != 0) {
        for(let i = 0; i < data.length; i++) {
            let monthYearObj = data[i]._id;
            let monthYearName = months[monthYearObj.month - 1] + " " + monthYearObj.year;
            let count = data[i].count;
            finalData.labels.push(monthYearName);
            finalData.data.push(count);
        }
    }
    return finalData;
}

function salesByProdCatMapper (data) {
    let finalData = {
        labels: [],
        data: []
    }
    if(data) {
        for(let i = 0; i < data.length; i++) {
            let count = data[i].count;
            finalData.labels.push(data[i]._id[0]);
            finalData.data.push(count);
        }
    }
    return finalData;
}

function topProductMarginMapper (data) {
    let finalData = {
        labels: [],
        data: []
    }
    if(data) {
        for(let i = 0; i < data.length; i++) {
            let count = data[i].margin;
            finalData.labels.push(data[i].product_name);
            finalData.data.push(count);
        }
    }
    return finalData;
}

module.exports = {

    responseMapping,
    responseMappingData,
    responseMappingList,
    responseMappingCount,

    monthNumberToName,
    salesByProdCatMapper,
    topProductMarginMapper

};
