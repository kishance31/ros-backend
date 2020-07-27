const dbConfig = require("./dbConfig");
const expressConfig = require("./expressConfig");
const path = require("path");
var envConfig = {};
var cfg = {};
var environment = process.env.NODE_ENV || "prod";

//ENV Config
switch (environment) {    
    case 'dev':
    case 'development':
        envConfig = require('./env/development');
        break;
    case 'prod':
    case 'production':
        envConfig = require('./env/production');
        break;
    case 'stag':
    case 'staging':
        envConfig = require('./env/staging');
        break;
}

var defaultConfig = {
    environment: "development",
    ip: 'localhost',
    port: 4009,
    protocol : 'http',
    TAG: "development",
    uploadDir : path.resolve("./uploads"),
    mongo: {
        dbName: 'apartmynts',
        dbUrl: "mongodb://localhost:27017/",
        options: {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    }
};

//Create Final Config JSON by extending env from default
var cfg = {...defaultConfig, ...envConfig};

//set logger
try {
    global.logger = require('./loggerConfig');
} catch (error) {
    global.logger = console;
}

//Export config module
module.exports = {
    cfg,
    dbConfig,
    expressConfig
};