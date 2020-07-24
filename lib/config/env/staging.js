module.exports = {
    environment: 'staging',
    port: 4009,
    protocol : 'http',
    TAG: "staging",
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
    isStag: true,
};
