module.exports = {
    environment: 'production',
    port: 7822,
    protocol : 'http',
    TAG: "production",
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
    isProd: true  
};
