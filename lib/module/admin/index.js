/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const adminRouter = require('express').Router();
const adminFacade = require('./adminFacade');
const middleware = require("../../middlewares");
const responseHandler = require('./../../commonHandler/responseHandler');
const validators = require('./adminValidators');
const jwtHandler = require('./../../commonHandler/jwtHandler');

/**
* @api {post} /login
* @apiName Admin Login
* @apiPermission Admin
* @apiGroup User
*
* @apiParam  {String} [email] Email
* @apiParam  {String} [password] Password
*
* @apiSuccess (200) {Object} mixed `Response` object
* @apiFailure (500) {Object} mixed `Response` object
*/
adminRouter.route('/login').post([validators.validateLogin], (req, res) => {
    const userObj = { email, password } = req.body;
    adminFacade.login(userObj).
        then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});

/**
* @api {post} /approve
* @apiName Approve Corporater-Admin Account
* @apiPermission Admin
* @apiGroup User
*
* @apiParam  {String} [corporaterUserId] CorporaterAdminUserId
*
* @apiSuccess (200) {Object} mixed `Response` object
* @apiFailure (500) {Object} mixed `Response` object
*/
adminRouter.route('/approve/corporate-admin/:corporateUserId').post([validators.checkAdminValidation], (req, res) => {
    let { corporateUserId } = req.params;
    adminFacade.approveCorporateUser(corporateUserId).
        then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});

/**
* @api {post} /reject
* @apiName Reject Corporater-Admin Account
* @apiPermission Admin
* @apiGroup User
*
* @apiParam  {String} [corporaterUserId] CorporaterAdminUserId
*
* @apiSuccess (200) {Object} mixed `Response` object
* @apiFailure (500) {Object} mixed `Response` object
*/
adminRouter.route('/reject/corporate-admin/:corporateUserId').post([validators.checkAdminValidation], (req, res) => {
    let { corporateUserId } = req.params;
    adminFacade.rejectCorporateUser(corporateUserId).
        then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});

// forgot password
// userRouter.route('/forgot_password').post((req, res) => {
//     const userObj = { email } = req.body;
//     userFacade.forgot_password(userObj)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);

//         });
// });

//  Reset Password
// userRouter.route('/reset').post([validators.validateResetPassword], (req, res) => {
//     const data = {password, new_password, confirm_password } = req.body;
//     userFacade.resetPassword(data)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);
//         });
// });

// Get owner detail route
// userRouter.route('/get-user').get([middleware.authenticate.autntctTkn], (req, res) => {
//     const data = {
//         userId: req.userId,
//         email: req.email
//     };
//     userFacade.getUser(data)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);
//         });
// });

// // logout the user
// userRouter.route('/logout').get([middleware.authenticate.autntctTkn], (req, res) => {
//     const data = {
//         token: req.headers.tokens,
//         userId: req.userId,
//     };
//     userFacade.logout(data)
//         .then(result => {
//             responseHandler.sendSuccess(res, result);
//         })
//         .catch(err => {
//             responseHandler.sendError(res, err);
//         });
// });

module.exports = adminRouter;