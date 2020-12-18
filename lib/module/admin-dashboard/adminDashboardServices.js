const adminDashboardDao = require('./adminDashboardDao');
const adminDashboardMapper = require('./adminDashboardMapper');
const adminDashboardConstants = require('./adminDashboardConstants');

exports.corporateUserCount = async (dt) => {
    try {
        return adminDashboardDao.corporateUserCount(dt)
            .then((result) =>
                adminDashboardMapper.responseMappingData(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, result)
            )
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        return adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.employeeUserCount = async (dt) => {
    try {
        return adminDashboardDao.employeeUserCount(dt)
            .then((result) =>
                adminDashboardMapper.responseMappingData(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, result)
            )
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        return adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.purchaseLicenseCount = async (dt) => {
    try {
        return adminDashboardDao.purchaseLicenseCount(dt)
            .then((result) =>
                adminDashboardMapper.responseMappingCount(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, result)
            )
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        return adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.totalLicenseIncome = async (dt) => {
    try {
        return adminDashboardDao.totalLicenseIncome(dt)
            .then((result) =>
                adminDashboardMapper.responseMappingCount(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, result)
            )
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        return adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.newOrderIncome = async (dt) => {
    try {
        return adminDashboardDao.newOrderIncome(dt)
            .then((result) =>
                adminDashboardMapper.responseMappingCount(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, result)
            )
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        return adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.recurringIncome = async (dt) => {
    try {
        return adminDashboardDao.recurringIncome(dt)
            .then((result) =>
                adminDashboardMapper.responseMappingCount(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, result)
            )
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        return adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.productsCount = async () => {
    try {
        return adminDashboardDao.productsCount()
            .then((result) =>
                adminDashboardMapper.responseMappingData(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, result)
            )
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        return adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.getCustomerSignupCount = () => {
    try {
        return adminDashboardDao.getCustomerSignupCount()
            .then((result) => {
                let finalResult = adminDashboardMapper.monthNumberToName(result);
                return adminDashboardMapper.responseMappingData(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, finalResult)
            })
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        // error send exception
        return adminDashboardMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.salesByProductCategory = () => {
    try {
        return adminDashboardDao.salesByProductCategory()
            .then((result) => {
                let finalResult = adminDashboardMapper.salesByProdCatMapper(result);
                return adminDashboardMapper.responseMappingData(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, finalResult)
            })
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        // error send exception
        return adminDashboardMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.COUNT_ERROR);
    }
}

exports.topProfitMarginProducts = () => {
    try {
        return adminDashboardDao.topProfitMarginProducts()
            .then((result) => {
                let finalResult = adminDashboardMapper.topProductMarginMapper(result);
                return adminDashboardMapper.responseMappingData(adminDashboardConstants.CODE.Success, adminDashboardConstants.MESSAGES.COUNT_SUCCESS, finalResult)
            })
            .catch(err =>
                adminDashboardMapper.responseMapping(adminDashboardConstants.CODE.INTRNLSRVR, adminDashboardConstants.MESSAGES.COUNT_ERROR)
            )
    } catch (error) {
        // error send exception
        return adminDashboardMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.COUNT_ERROR);
    }
}