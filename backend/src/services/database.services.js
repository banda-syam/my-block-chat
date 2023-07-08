const { MongoClient } = require("mongodb");

require("dotenv").config();

process.env.DB_CONNECTION_LINK = process.env.DB_CONNECTION_LINK.replace("<username>", process.env.DB_USERNAME);
process.env.DB_CONNECTION_LINK = process.env.DB_CONNECTION_LINK.replace("<password>", process.env.DB_PASSWORD);
process.env.DB_CONNECTION_LINK = process.env.DB_CONNECTION_LINK.replace("<name>", process.env.ENVIRONMENT);

const client = new MongoClient(process.env.DB_CONNECTION_LINK);

async function connectdb() {
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      console.log("Successfully connected to database");
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

const transactionOptions = {
  readPreference: "primary",
  readConcern: { level: "local" },
  writeConcern: { w: "majority" },
};

module.exports = { connectdb, client, db: client.db(), transactionOptions };
