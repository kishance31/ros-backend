# ROS_Back_End
ROS Node Express Mongo server [ Rest APIs ]

## Prerequisites:

- Nodejs (version 10.x)
- Npm (version 6.x)
- MongoDB (version 3.x) (only for development)

## Steps to run the project:

- Make sure nodejs, mongodb(default port:27017) is install and is accessable through commandline.
- You can test npm by typing `npm -v` to check the npm version.
- Verify node.js version e.g. `node -v`.
- Install all dependencies, Run "npm install". THis will install all the packages to run the project.
- you are running for development mode: Run command `npm run dev`


# Folder structure:
    - config
        - environments specific information
        - database connection settings/configuration
    - models:
        - Table/Schema 
        - Response Structure
    - modules:
        - role specific contents (Like - admin, corporater-admin, employee )
    - routes:
        - Route handling for incoming requests to the server


## Rest APIs Skeleton

[Postman collection file](https://www.getpostman.com/collections/2c1d096e668050b6fe7b) 
