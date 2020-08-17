exports.licenseExists = (type) => {
    return {
        responseMessage: `License type: ${type} already exists.`,
        responseCode: 400,
    }
};

exports.licenseCreateSuccess = (type) => {
    return {
        responseMessage: `License type: ${type} added.`,
        responseCode: 201,
    }
};

exports.licenseList = (data) => {
    return {
        responseMessage: `All License List`,
        responseCode: 200,
        licenseList: data,
    }
}