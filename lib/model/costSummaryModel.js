// Importing mongoose
const mongoose = require("mongoose");
const constants = require('../constants');
const Schema = mongoose.Schema;

const CostSummarySchema = new Schema({
    // id will be auto generated
  
    license_name: {
        type: String
    },
    monthly_subscription:{
        type:Number,
        default:1
    },
    initialCost: {
        type: Number,
        default:0

    },
    monthlyCost: {
        type: Number,
        default:0

    },
    noOfInstallmentCost: {
     
            type: Number,
            default:0
  
    },
    oneYearMonthlyCost:{
        type:Number,
        default:0
    },
    oneYearInstallmentCost:{
        type:Number,
        default:0
    }

   },
  {
    timestamps: true
  });

module.exports = mongoose.model(constants.DB_MODEL_REF.COSTSUMMARY, CostSummarySchema);
