module.exports = {
    environment: 'development',
    port: 4000,
    protocol : 'http',
    TAG: "development",
    mongo: {
        dbName: 'ros',
        dbUrl: "mongodb://localhost:27017/",
        options: {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    },
    isDev:true,
    API_SECRET: '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',
    
    /** REQUIRED FIELD */
    DEFAULT_ADMIN_USER : {          
        email: "admin@ros.org",
        username: "admin",
        password: "root@1234567890",
        role: "ADMIN"
    }

};
