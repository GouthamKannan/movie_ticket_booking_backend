const mongodb = require("mongodb");
require("dotenv").config();

const mongodbPassword = process.env.MONGODB_PASSWORD;

const url = `mongodb+srv://goutham:${mongodbPassword}@database.0mmh4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new mongodb.MongoClient(url);
console.log(`DB connected :: ${mongodbPassword}`);

client.connect().catch((err) => {
  console.error("Error in connecting to mongodb :: ", err);
});

module.exports = { client };
