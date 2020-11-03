const adminDashboardRouter = require('express').Router();
const adminDashboardServices = require('./adminDashboardServices');
const responseHandler = require('./../../commonHandler/responseHandler');
const authMiddleware = require('../../middlewares/auth');

adminDashboardRouter.route('/getCorporateUserCount/:filterDate?')
    .get([], (req, res) => {
        adminDashboardServices.corporateUserCount(req.params.filterDate).then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        })
    })

adminDashboardRouter.route('/getEmployeeUserCount/:filterDate?')
    .get([], (req, res) => {
        adminDashboardServices.employeeUserCount(req.params.filterDate).then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        })
    })

adminDashboardRouter.route('/getPurchaseLicenseCount/:filterDate?')
    .get([], (req, res) => {
        console.log('hit')
        adminDashboardServices.purchaseLicenseCount(req.params.filterDate).then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        })
    })

adminDashboardRouter.route('/getTotalLicenseIncome/:filterDate?')
    .get([], (req, res) => {
        console.log('hit')
        adminDashboardServices.totalLicenseIncome(req.params.filterDate).then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        })
    })

adminDashboardRouter.route('/getnewOrderIncome/:filterDate?')
    .get([], (req, res) => {
        adminDashboardServices.newOrderIncome(req.params.filterDate).then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        })
    })

adminDashboardRouter.route('/getRecurringIncome/:filterDate?')
    .get([], (req, res) => {
        console.log('hit')
        adminDashboardServices.recurringIncome(req.params.filterDate).then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        })
    })

adminDashboardRouter.route('/getProductsCount')
    .get([], (req, res) => {
        adminDashboardServices.employeeUserCount().then((result) => {
            responseHandler.sendSuccess(res, result)
        }).catch((err) => {
            responseHandler.sendError(res, err)
        })
    })

module.exports = adminDashboardRouter;