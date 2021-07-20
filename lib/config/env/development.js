module.exports = {
    environment: 'development',
    port: 4000,
    protocol: 'http',
    TAG: "development",
    clientUrl: "http://localhost:3000",
    adminUrl: "http://localhost:3000",
    serverUrl: "http://localhost:4000",
    smtp_host: 'smtp.gmail.com',
    smtp_port: 465,
    email_auth: 'remoteofficessolutions@gmail.com',
    email_pswd: 'Test1234%',
    mongo: {
        dbUrl: "mongodb://localhost:27017/ros",
        options: {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    },
    isDev: true,
    API_SECRET: "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",
    // "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",
    FROM_EMAIL: "jeena.varghese@codezeros.com",
    RESET_CLIENT_URL: "http://localhost:3000/auth/reset-password",
    ADMIN_MAIL_ID: "nilesh.lundwani@codezeros.com",
    RESET_PSWD_CORPORATE_URL: "http://localhost:3000/home",

    /** REQUIRED FIELD */
    DEFAULT_ADMIN_USER: {
        email: "admin@ros.org",
        username: "admin",
        password: "root@1234567890",
        role: "ADMIN",
        firstName: "Admin",
        lastName: "ROS",
        isDeleted: false,
    },
    DEFAULT_SUPER_ADMIN: {
        "roleName" : "ROS Super Admin",
        "permissions" : [
            {
                "name" : "Manage User",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "Roles & Permissions",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "Permission",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "Manage Category",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "Import Item from Vendor",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "Manage License",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "Corporate Management",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "CMS Settings",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name" : "Email Template Settings",
                "types" : [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            }
        ],
        "isDefault" : true
    },

    DEFAULT_ADMIN_ROLE_NAME: {
        "roleName": "ROS Super Admin",
        "permissions": [
            {
                "name": "Manage User",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "Roles & Permissions",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "Permission",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "Manage Category",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "Import Item from Vendor",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "Manage License",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "Corporate Management",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "CMS Settings",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            },
            {
                "name": "Email Template Settings",
                "types": [
                    "Add",
                    "Edit",
                    "Veiw",
                    "Delete",
                    "Active",
                    "Deactive",
                    "Approve",
                    "Reject"
                ]
            }
        ]
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
        recurringMonthsNo: 9,
        firstYearCharge: 20,
        firstYearTerm: 12,
        secondYearCharge: 10,
        secondYearTerm: 12,
    },

    //default contact us
    CONTACT_US_DATA: {
        contact: "110-110-1111",
        email: "info@ros.org",
        address: "A-1, ABC ROAD, ABC PLCAE, US - 90909",
    },

    DEFAULT_EMAIL_TEMPLATES: [
        {
            title: "CORPORATE_APPROVE",
            subject: "Account Status",
            description: "Congratulations, Your account has been approved."
        },
        {
            title: "CORPORATE_REJECT",
            subject: "Account Status",
            description: "Your account has been rejected. Please upload documents again."
        },
        {
            title: "ADMIN_FORGOT_PASSWORD",
            subject: "Reset your password!",
            description: "You have received this email because a password reset request for your account is received. If its not created by you ignore this mail. Click the button below to reset your password."
        },
        {
            title: "ADMIN_RESET_PASSWORD",
            subject: "Reset your password!",
            description: "Your password has been changed successfully."
        },
        {
            title: "ORDER_DISPATCH_STATUS",
            subject: "Order Dispatch Status",
            description: "Below are the latest order details"
        },
        {
            title: "REPLY_CONTACT_US_QUERY",
            subject: "Contact us query",
            description: "Thank you for reaching to us."
        },
        {
            title: "CORPORATE_SIGN_UP",
            subject: "Corporate Admin Sign UP!",
            description: "Thank you for registering with us as your profile has been successfully sent for Verification!"
        },
        {
            title: "CORPORATE_FORGOT_PASSWORD",
            subject: "Reset your password!",
            description: "You have received this email because a password reset request for your account is received. If its not created by you ignore this mail. Click the button below to reset your password."
        },
        {
            title: "CORPORATE_RESET_PASSWORD",
            subject: "Reset your password!",
            description: "Your password has been changed successfully."
        },
        {
            title: "CORPORATE_ORDER_PAYMENT",
            subject: "Corporate order payment",
            description: "Below are the new order details confirmed and paid by the corporate."
        },
        {
            title: "SEND_ORDER_TO_VENDOR",
            subject: "New Order Information",
            description: "Below are the order details needs to be delivered."
        },
        {
            title: "ADMIN_ORDER_CONFIRM",
            subject: "Admin Order Confirmation",
            description: "Your order has been confirmed. Below are the order details.",
        },
        {
            title: "RECURRING_INVOICE_PAYMENT",
            subject: "Recurring Invoice Payment",
            description: "Your payment is successfull. Below are the order details.",
        },
        {
            title: "CORPORATE_LICENSE_PURCHASE",
            subject: "License Purchase!",
            description: "License purchase successfull. You can find more details in the ROS App."
        }
    ]
};