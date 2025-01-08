import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Developer Foundry TO DO API',
    description: 'Developer Foundry To Do API'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],              // by default: ['http']
  consumes: ['application/json'],             // by default: ['application/json']
  produces: ['application/json'],             // by default: ['application/json']
  tags: [                   // by default: empty Array
    {
      name: 'Auth',             // Tag name
      description: 'User authentication'       // Tag description
    },
    {
      name: 'Task',             // Tag name
      description: 'Task management'      // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {},  // by default: empty object
  definitions: {
    User: {
        first_name: "string",
        last_name: "string",
        username: "string",
        email: "string",
        password: "string",
        phone: "string",
        avatar: "string",
        status: "string",
        gender: 'Female',
        date_of_birth: "2023-09-91",
        is_verified_email: true,
        is_completed_onboarding_kyc: true,
        is_deleted: true,
        last_login: "2023-09-12",
        date_deleted: null,
        last_failed_attempt: null,
        passwordRetryCount: 2,
        passwordRetryMinutes: 12,
    },
    AuthUser: {
        user: {
            first_name: "string",
            last_name: "string",
            username: "string",
            email: "string",
            phone: "string",
            avatar: "string",
            status: "string",
            gender: 'Female',
            date_of_birth: "2023-09-91",
            is_verified_email: true,
            is_completed_onboarding_kyc: true,
            is_deleted: true,
            last_login: "2023-09-12",
            date_deleted: null,
            last_failed_attempt: null,
            passwordRetryCount: 2,
            passwordRetryMinutes: 12,
        },
        access_token: "string",
        refresh_token: "string"
    }
  } 
};

const outputFile = './swagger.json';
const routes = ['./src/routes/v1/index'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);