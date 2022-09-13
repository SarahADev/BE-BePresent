## Hosted Version Link

https://be-present.fly.dev/

## Project Summary

This backend has been built using express and connects to our MongoDB/Atlas database. It is designed as a waypoint for our frontend application to communicate with the database. The final result is an app called 'Be Present', a gifting/social platform where users receive gift recommendations for their friends based on preferences that they have set.

## Install Dependencies

By default, 'npm install' will install all modules listed as dependencies in package.json. In this case this will install: 

    "axios": "^0.27.2",
    "bcrypt": "^5.0.1",
    "cors": "^2.8.5",
    "dotenv": "^16.0.2",
    "express": "^4.18.1",
    "mongodb": "^4.9.1",
    "nodemon": "^2.0.19",
    "uuid": "^9.0.0"

If you would like to run the tests contained in the test folder you will also need to install the following as devDependencies (npm install -D "jest" for example):

"jest": "^27.5.1", "supertest": "^6.2.4".

## .env

In order to connect this server to your database you will need to setup a '.env' file which contains the following:

"URI=<'YOUR URI'>"

Each model is designed to connect to a database called "test-data" when running the tests and "dev-data" when accessing the live version. Be sure to stick to this naming convention when setting up your database otherwise you will need to edit each model to reflect this difference.

## Version Requirements

In order to run this project the minimimum version requirements are as follows:

Node.js: "18.6.0"