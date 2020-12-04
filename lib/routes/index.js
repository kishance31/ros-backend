
const responseHandler = require('./../commonHandler/responseHandler');
const authMiddleware = require('../middlewares/auth');
const corporateAdminRouter = require('../module/corporate-admin');
const adminRouter = require('../module/admin');
const adminDashboardRouter = require('../module/admin-dashboard');
const branchRouter = require('../module/branch/branchRoute');
const employeeRouter = require('../module/employee/employeeRoute');
const categoryRouter = require('../module/category/categoryRoute');
const subcategoryRouter = require('../module/subcategory/subcategoryRoute');
const productRouter = require('../module/product/productRoute');
const cartRouter = require('../module/cart/cartRoute');
const licenseRouter = require('../module/licenses');
const purchaseLicenseRouter = require('../module/corporate-purchase-license');
const adminRolesRouter = require('../module/admin-roles');
const costSummaryRouter = require('../module/cost-summary/costSummaryRoute');
const emailTemplateRouter = require('../module/email-template/emailTemplateRoute');
const cmsRouter = require('../module/cms/cmsRoute');

// const uploadRouter = require('./module/upload/upload');

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.send("Server is running.")
    });

    app.get('/api/auth/verifyUserToken', [authMiddleware.autntctTkn, authMiddleware.checkUserActive], (req, res) => {
        responseHandler.sendSuccess(res, { responseCode: 200 });
    })

    // Attach User Routes
    app.use('/api/admin', adminRouter);
    app.use('/api/admin/dashboard', adminDashboardRouter);
    app.use('/api/admin/cms', cmsRouter);
    // app.use('/api/admin/vendor', vendorRouter);
    app.use('/api/admin/role', adminRolesRouter);
    app.use('/api/admin/cost-summary', costSummaryRouter)
    app.use('/api/admin/email-template', emailTemplateRouter)
    app.use('/api/corporate-admin', corporateAdminRouter);
    app.use('/api/corporate-admin/employee', employeeRouter)
    app.use('/api/corporate-admin/category', categoryRouter)
    app.use('/api/corporate-admin/sub-category', subcategoryRouter)
    app.use('/api/corporate-admin/product', productRouter)
    app.use('/api/employee/cart', cartRouter)

    //license routes
    app.use('/api/license', licenseRouter);
    app.use('/api/corporate-admin/purchaseLicense', purchaseLicenseRouter)

    app.use('/api/branch', branchRouter)
    app.use(responseHandler.hndlError);
};
