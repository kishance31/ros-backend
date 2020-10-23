module.exports = {
    environment: 'stagging',
    port: 4000,
    protocol: 'http',
    TAG: "stagging",
    clientUrl: "http://3.18.139.243:5010",
    adminUrl: "http://3.18.139.243:5005",
    mongo: {
        dbName: 'ros',
        dbUrl: "mongodb://admin-ros:pwd-ros123@localhost:27017,localhost:27018,localhost:27019/ros",
        options: {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    },
    isProd: false,
    API_SECRET: "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",
    FROM_EMAIL: "jeena.varghese@codezeros.com",
    RESET_CLIENT_URL: "http://3.18.139.243:5005/auth/reset-password",
    ADMIN_MAIL_ID: "nilesh.lundwani@codezeros.com",
    RESET_PSWD_CORPORATE_URL: "http://3.18.139.243:5010",

    /** REQUIRED FIELD */
    DEFAULT_ADMIN_USER: {
        email: "admin@ros.org",
        username: "admin",
        password: "root@1234567890",
        role: "ADMIN",
        firstName: "ROS",
        lastName: "ADMIN",
    },

    DEFAULT_ADMIN_FORMS: [
        {
            name: "Admin Management",
            route: "/admin-management",
            subForms: [{
                name: "Manage User",
                route: "/manage-user"
            }, {
                name: "Roles & Permissions",
                route: "/role-permission"
            }, {
                name: "Permission",
                route: "/permission"
            }]
        },
        {
            name: "Category Management",
            route: "/category-management",
            subForms: [{
                name: "Manage Category",
                route: "/manage-category"
            }, {
                name: "Import Item from Vendor",
                route: "/import-item"
            }]
        },
        {
            name: "License Management",
            route: "/license-management",
            subForms: [{
                name: "Manage License",
                route: "/manage-license"
            }]
        },
        {
            name: "Corporate Management",
            route: "/corporate-management",
            subForms: []
        },
        {
            name: "General Settings",
            route: "/general-settings",
            subForms: [{
                name: "CMS Settings",
                route: "/cms-settings"
            }, {
                name: "Email Template Settings",
                route: "/email-template-settings"
            }]
        },
    ],
    ROLE_PERMISSIONS: ['Add', 'Edit', 'Veiw', 'Delete', 'Active', 'Deactive', 'Approve', 'Reject'],

    //Default cost summary data
    COST_SUMMARY: {
        firstTimeMonths: 3,
        recurringMonthsNo: 9
    },

    //default contact us
    CONTACT_US_DATA: {
        contact: "110-110-1111",
        email: "info@ros.org",
        address: "A-1, ABC ROAD, ABC PLCAE, US - 90909",
    }
};
