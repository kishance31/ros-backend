// Importing mongoose
const mongoose = require("mongoose");
const constants = require('../constants');
const Schema = mongoose.Schema;

const CostSummarySchema = new Schema(
    {
        // id will be auto generated
        firstTimeMonths: {
            type: Number,
            required: true,
        },
        recurringMonthsNo: {
            type: Number,
            required: true,
        },
        firstYearCharge: {
            type: Number,
            required: true,
        },
        firstYearTerm: {
            type: Number,
            required: true,
        },
        secondYearCharge: {
            type: Number,
            required: true,
        },
        secondYearTerm: {
            type: Number,
            required: true,
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(constants.DB_MODEL_REF.COSTSUMMARY, CostSummarySchema);
