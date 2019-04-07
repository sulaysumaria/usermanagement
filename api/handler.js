const Joi = require('joi');

const { db } = require('./helpers/db');

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

async function getUsers() {
  return new Promise(async (resolve) => {
    try {
      const dbConn = await db();
      const dbo = dbConn.db('usermanagement');

      const users = await dbo
        .collection('users')
        .find()
        .toArray();

      await dbConn.close();

      return resolve({
        statusCode: 200,
        body: JSON.stringify({
          users,
          success: true,
        }),
      });
    } catch (e) {
      console.log(e);
      return resolve({
        statusCode: 500,
        body: JSON.stringify({
          message: 'Some error occurred. Please try again later.',
        }),
      });
    }
  });
}

async function createUser(event) {
  return new Promise(async (resolve) => {
    try {
      let body;
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = {};
      }

      const result = Joi.validate(body, userSchema, { abortEarly: false });

      if (result.error) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({
            message: result.error.details.map((a) => a.message),
          }),
        });
      }

      const dbConn = await db();
      const dbo = dbConn.db('usermanagement');

      await dbo.collection('users').insert(body);

      await dbConn.close();

      return resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: 'User created',
        }),
      });
    } catch (e) {
      console.log(e);
      return resolve({
        statusCode: 500,
        body: JSON.stringify({
          message: 'Some error occurred. Please try again later.',
        }),
      });
    }
  });
}

module.exports = {
  ping,
  getUsers,
  createUser,
};
