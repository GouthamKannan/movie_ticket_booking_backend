const { client: mongoClient } = require("../models/mongodb");

const dbConnection = mongoClient.db("ticket_booking");
const movieCollection = dbConnection.collection("movie");

const create = async (name, genre, duration, photo, status) => {
  const response = await movieCollection.insertOne({
    name,
    genre,
    duration,
    photo,
    status,
  });
  return response;
};

const getAll = () => {
  return movieCollection.find().toArray();
};

const getOneUser = ( name ) => {
  return movieCollection.find({ name: name }).toArray();
};

const update = (name, fieldsToUpdate) => {
  return movieCollection.updateOne(
    { name: name },
    { $set: fieldsToUpdate }
  );
};

const deleteRecord = (name) => {
  return movieCollection.deleteOne({ name: name });
};

module.exports = {
  create,
  getAll,
  getOneUser,
  update,
  deleteRecord,
};
