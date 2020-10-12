module.exports = {
    environment: 'development',
    port: 4000,
    protocol: 'http',
    TAG: "development",
    clientUrl: "http://localhost:3000",
    adminUrl: "http://localhost:3000",
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
    isDev: true,
    API_SECRET: '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',
    FROM_EMAIL: "jeena.varghese@codezeros.com",
    RESET_CLIENT_URL: "http://localhost:3000/auth/reset-password",

    /** REQUIRED FIELD */
    DEFAULT_ADMIN_USER: {
        email: "admin@ros.org",
        username: "admin",
        password: "root@1234567890",
        role: "ADMIN"
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
            name: "Invoice Management",
            route: "/invoice-management",
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
};
