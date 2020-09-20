const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const AdminPanelFormsSchema = new Schema({
    names: {
        type: [{
            name: String,
            subForms: [Schema.Types.Mixed],
            route: String,
        }],
        default: [],
    },
    types: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model(constants.DB_MODEL_REF.ADMIN_PANEL_FORMS, AdminPanelFormsSchema);