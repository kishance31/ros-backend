"use strict";

const { response } = require("express");

exports.generateOrderIdError = () => {
    return {
        responseMessage: "Order Id not generated",
        responseCode: 500,
    }
}

exports.generateOrderIdSuccess = (orderDetails) => {
    return {
        responseMessage: "Order Id generated",
        responseCode: 201,
        orderDetails,
    }
}

exports.generateTokenInvalidError = () => {
    return {
        responseMessage: "Corporate Id or Token is invalid.",
        responseCode: 400,
    }
}

exports.invalidUserIdError = () => {
    return {
        responseMessage: "Corporate Id is invalid.",
        responseCode: 400,
    }
}

exports.invalidUserError = () => {
    return {
        responseMessage: "Corporate admin not exits.",
        responseCode: 400,
    }
}

exports.purchaseLicenseError = () => {
    return {
        responseMessage: "Error purchasing licenses. Try again after some time or contact administration.",
        responseCode: 500,
    }
}

exports.orderIdNotExists = (orderId) => {
    return {
        responseMessage: `Incorrect license order id : ${orderId}.`,
        responseCode: 500,
    }
}

exports.purchaseLicenseSuccess = (data) => {
    return {
        responseMessage: `Purchase license success.`,
        responseCode: 201,
        purchaseLicenses: data
    }
}

exports.getPurchaseLicenseError = () => {
    return {
        responseMessage: 'Error getting purchase license list.',
        responseCode: 400,
    }
}

exports.getPurchaseLicenseList = (data) => {
    try {
        return {
            responseMessage: `Get purchase license success.`,
            responseCode: 200,
            purchaseLicenses: data[0].list,
            totalCount: data[0].total[0].count
        }
    } catch (error) {
        return this.getPurchaseLicenseError()     
    }
}