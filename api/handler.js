const Joi = require('joi');

const { db } = require('./helpers/db');

// schema for validating user object when adding new user
const userSchema = Joi.object().keys({
  firstName: Joi.string()
    .min(5)
    .max(30)
    .required(),
  lastName: Joi.string()
    .min(5)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
});

// dummy route to check status of service
async function ping() {
  return new Promise(async (resolve) => {
    try {
      return resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: 'Service is up and running.',
        }),
      });
    } catch (e) {
      console.log(e);
    }
  });
}

// get all users
async function getUsers() {
  return new Promise(async (resolve) => {
    try {
      // get connection to mongodb
      const dbConn = await db();

      // get database instance
      const dbo = dbConn.db('usermanagement');

      // get all users
      const users = await dbo
        .collection('users')
        .find()
        .toArray();

      // close db connection
      await dbConn.close();

      // return users
      return resolve({
        statusCode: 200,
        body: JSON.stringify({
          users,
          success: true,
        }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
      });
    } catch (e) {
      console.log(e);
      return resolve({
        statusCode: 500,
        body: JSON.stringify({
          message: 'Some error occurred. Please try again later.',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
      });
    }
  });
}

async function createUser(event) {
  return new Promise(async (resolve) => {
    try {
      // parse body
      let body;
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = {};
      }

      // validate body
      const result = Joi.validate(body, userSchema, { abortEarly: false });

      // return errors if any error
      if (result.error) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({
            message: result.error.details.map((a) => a.message),
          }),
          headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
          },
        });
      }

      // get connection to mongodb
      const dbConn = await db();

      // get database instance
      const dbo = dbConn.db('usermanagement');

      // insert new user
      await dbo.collection('users').insert(body);

      // close connection
      await dbConn.close();

      // return response
      return resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: 'User created',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
      });
    } catch (e) {
      console.log(e);
      return resolve({
        statusCode: 500,
        body: JSON.stringify({
          message: 'Some error occurred. Please try again later.',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
      });
    }
  });
}

module.exports = {
  ping,
  getUsers,
  createUser,
};
