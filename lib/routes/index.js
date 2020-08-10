
const responseHandler = require('./../commonHandler/responseHandler');
const corporateAdminRouter = require('../module/corporate-admin');
const adminRouter = require('../module/admin');
// const uploadRouter = require('./module/upload/upload');

module.exports = function (app) {

    // Attach User Routes
    app.use('/api/corporate-admin', corporateAdminRouter);
    app.use('/api/admin', adminRouter);

    app.use(responseHandler.hndlError);
};
