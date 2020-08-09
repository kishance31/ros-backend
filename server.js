'use strict';

console.log("");
console.log("//************************* ROS **************************//");
console.log("");

//Import Config
const config = require('./lib/config');
const adminServices = require('./lib/module/admin/adminService');

config.dbConfig(config.cfg, (err) => {
    if (err) {
        logger.error(err, 'exiting the app.');
        return;
    }

    // load external modules
    const express = require("express");

    // init express app
    const app = express();

    // set server home directory
    app.locals.rootDir = __dirname;
 
    // config express
    config.expressConfig(app, config.cfg.environment);
    if(err)return res.json(err)
    
    // attach the routes to the app
    require("./lib/routes")(app);

    // pre-load default data
    adminServices.createdefaultAdmin();

    // start server
    app.listen(config.cfg.port, () => {
        logger.info(`Express server listening on ${config.cfg.port}, in ${config.cfg.TAG} mode`);
    });
});
