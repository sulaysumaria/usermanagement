const MongoClient = require('mongodb').MongoClient;

module.exports.db = () => {
  return MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
};
