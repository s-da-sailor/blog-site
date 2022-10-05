# Just-Another-Blogsite

[https://just-another-blogsite.netlify.app](https://just-another-blogsite.netlify.app)

A RestAPI implementation of a blog site that supports authentication and authorization and can provide response data in a variety of formats with content-negotiation. This is a NodeJS-based backend of this application.

## Quick Overview

- **API ENDPOINTS**

  **_/api/v1/stories_**

      Supported Methods:
                              GET
                              POST

  **_/api/v1/stories/:id_**

      Supported Methods:
                              GET
                              PATCH
                              PUT
                              DELETE

  **_/api/v1/users_**

      Supported Methods:
                              GET

  **_/api/v1/users/signup_**

      Supported Methods:
                              POST

  **_/api/v1/users/login_**

      Supported Methods:
                              POST

  **_/api/v1/users/logout_**

      Supported Methods:
                              POST

  **_/api/v1/users/verify_**

      Supported Methods:
                              POST

  **_/api/v1/users/search_**

      Supported Methods:
                              POST

  **_/api/v1/users/:username_**

      Supported Methods:
                              GET
                              PATCH
                              PUT
                              DELETE

  **_/api/v1/users/:username/stories_**

      Supported Methods:
                              GET

- **Types of Contents Served**

          Accept: application/json
          Accept: application/xml
          Accept: text/plain
          Accept: text/html

## Quick start

1.  **Get to the workplace.**

    After cloning this repository navigate into your api directory and load it in your IDE/Editor

    ```shell
    cd directory_name
    code .  #to open in vscode
    ```

2.  **Open the source code and start editing**

    - Update the environement variables in config.env file

    - Install the dependencies and run the server.

      ```shell
      npm install
      npm run dev #run with nodemon for auto reload
      npm start #default starter
      npm run test #run unit tests
      ```

    By default this server will be running at `http://localhost:8000`!

## Project Structure

    ├── controllers/
      ├── authController.js
      ├── storyController.js
      ├── userController.js
    ├── middlewares/
      ├── globalErrorHandlingMiddleware.js
      ├── routeProtectionMiddleware.js
      ├── verificationMiddleware.js
    ├── models/
      ├── storyModel.js
      ├── userModel.js
    ├── routes/
      ├── storyRoutes.js
      ├── userRoutes.js
    ├── services/
      ├── storyService.js
      ├── userService.js
    ├── tests/
      ├── unitTest/
        ├── controllers/
          ├── authController.test.js
          ├── storyController.test.js
          ├── userController.test.js
        ├── Services/
          ├── storyService.test.js
          ├── userService.test.js
        ├── utils/
          ├── contentNegotiation.test.js
    ├── utils/
      ├── AppError.js
      ├── catchAsync.js
      ├── contentNegotiation.js
      ├── setConfig.js
      ├── throwError.js
      ├── unhandledRouteHandler.js
    ├── app.js
    └── config.env
    └── database.js
    └── package-lock.json
    └── package.json
    └── server.js
    

1.  **`controllers/`**: Contains `Authenication Controller`, `Story Controller`, and `User Controller`.

2.  **`middleware/`**: Contains the middlewares to execute before handling a request. User token verfication and route protection and errors are handled here.

3.  **`models/`**: This directory contains `Story` and `User` data models and DB operations related to that model.

4.  **`routes/`**: This directory contains all of the routing related modules.

5.  **`services/`**: This directory contains `Story Service` and `User Service`.

6.  **`tests/`**: This directory contains unit tests for Controllers, Services and Utils.

7.  **`utils/`**: Utility functions used in this project are stored here, including content negotiation.

8.  **`app.js`**: This is the starter file for for this API.

9. **`config.env`**: A text file containing environment variables to run this project project.

10.  **`database.js`**: This file contains codes for connecting database using database configurations.

11.  **`package.json`**: This is the main configuration file for for this API.

12.  **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

13.  **`server.js`**: This file contains codes for starting the server.
