module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send("ROS is up")
    });
}

const responseHandler = require('../responseHandler');
const usrRouter = require('../user/userRoute');

//========================== Load Modules End ==============================================

//========================== Export Module Start ====== ========================

module.exports = function (app) {

    // Attach User Routes
    app.use('/user', usrRouter);

    app.use(responseHandler.hndlError);
};
