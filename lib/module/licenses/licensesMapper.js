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

exports.generateTokenInvalidError = () => {
    return {
        responseMessage: "Corporate Id or Token is invalid.",
        responseCode: 400,
    }
}

exports.availabelLicenseCount = (data) => {
    return {
        responseMessage: `Available license count`,
        responseCode: 200,
        availabelLicenseCount: data,
    }
}

exports.availabelLicenseCountError = () => {
    return {
        responseMessage: `Error getting available license count`,
        responseCode: 400,
    }
}

exports.invalidUserError = () => {
    return {
        responseMessage: "Corporate admin not exits.",
        responseCode: 400,
    }
}

exports.decrementLicenseCount = () => {
    return {
        responseMessage: `Updated license count success`,
        responseCode: 201,
    }
}

exports.decrementLicenseCountZero = (licenseType) => {
    return {
        responseMessage: `${licenseType} license quantity is zero. Purchase a ${licenseType} license first.`,
        responseCode: 400,
    }
}

exports.decrementLicenseCountError = () => {
    return {
        responseMessage: `Update license count error`,
        responseCode: 400,
    }
}

exports.responseMapping = (code, msg) => {
    return {
        responseCode: code,
        responseMessage: msg
    }
}