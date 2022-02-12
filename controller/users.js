const { client: mongoClient } = require("../models/mongodb");

const dbConnection = mongoClient.db("ticket_booking");
const usersCollection = dbConnection.collection("users");

const create = async (username, emailId, password, roles) => {
  const response = await usersCollection.insertOne({
    username,
    emailId,
    password,
    roles,
  });
  return response;
};

const getAll = () => {
  return usersCollection.find().toArray();
};

const getOneUser = ( emailId ) => {
  return usersCollection.find({ emailId: emailId }).toArray();
};

const update = (emailId, fieldsToUpdate) => {
  return usersCollection.updateOne(
    { emailId: emailId },
    { $set: fieldsToUpdate }
  );
};

const deleteRecord = (emailId) => {
  return usersCollection.deleteOne({ emailId: emailId });
};

module.exports = {
  create,
  getAll,
  getOneUser,
  update,
  deleteRecord,
};
