const responseHandler = require('../responseHandler');
const usrRouter = require('../user/userRoute');
const uploadRouter = require('../upload/upload');

module.exports = function (app) {

    // Attach User Routes
    app.use('/user', usrRouter);

    app.use('/user', uploadRouter);

    app.use(responseHandler.hndlError);
};
