'use strict';


const costSummaryDao = require('./costSummaryDao');
const costSummaryMapper = require('./costSummaryMapper');
const costSummaryConstants = require("./costSummaryConstants");

async function costSummaryAdd(data, adminId) {
    try {

        const adminExists = await costSummaryDao.checkAdmin(adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(costSummaryConstants.CODE.Unauthorized, costSummaryConstants.MESSAGES.Unauthorized);
        }
        
        return costSummaryDao.saveCostSummary(data).then((data) => {
            return costSummaryMapper.responseMappingData(costSummaryConstants.CODE.Success, costSummaryConstants.MESSAGES.CostSummary_Added, data)
        }).catch((err) => {
            logger.warn(err);
            
            return costSummaryMapper.responseMapping(costSummaryConstants.CODE.INTRNLSRVR, err.message)
        })
    } catch (err) {
        console.log(err)
        return err;
    }
};

function getCostSummaryById(id) {
    try {
        return costSummaryDao.costSummaryById(id).then((data) => {
            return costSummaryMapper.responseMappingData(costSummaryConstants.CODE.Success, costSummaryConstants.MESSAGES.CostSummary_By_Id, data)

        }).catch((err) => {
            return costSummaryMapper.responseMapping(costSummaryConstants.CODE.INTRNLSRVR, costSummaryConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}

function costSummaryEditById(id, data) {
    try {
        return  costSummaryDao.updateCostSummary(id, data).then((data) => {
            return costSummaryMapper.responseMappingData(costSummaryConstants.CODE.Success, costSummaryConstants.MESSAGES.CostSummary_Update, data)

        }).catch((err)=>{
            return costSummaryMapper.responseMapping(costSummaryConstants.CODE.INTRNLSRVR, costSummaryConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

module.exports = {
    costSummaryAdd,
    getCostSummaryById,
    costSummaryEditById
};