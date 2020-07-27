'use strict';

//=================================== Load Modules start ===================================

//=================================== Load external modules=================================
const mongoose = require('mongoose');
// plugin bluebird promise in mongoose
mongoose.Promise = require('bluebird');

//=================================== Load Modules end =====================================


// Connect to Db
function connectDb(env, callback) {
    let dbName = env.mongo.dbName;
    let dbUrl = env.mongo.dbUrl;
    let dbOptions = env.mongo.options;
    if (env.isProd) {
        logger.info("configuring db in " + env.TAG + " mode");
        dbUrl = dbUrl + dbName;
    } else { 
        logger.info("configuring db in " + env.TAG + " mode");
        dbUrl = dbUrl + dbName;
        mongoose.set('debug', true);
    }
 
    logger.info("connecting to -> " + dbUrl);
    mongoose.connect(dbUrl, dbOptions);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        logger.info('connected to DB', dbName, 'at', dbUrl);
        callback();
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
        logger.error('DB connection error: ' + err);
        callback(err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        logger.warn('DB connection disconnected');
        callback("DB connection disconnected");
    });
}

module.exports = connectDb;
