const { client: mongoClient } = require("../models/mongodb");

const dbConnection = mongoClient.db("ticket_booking");
const theatreCollection = dbConnection.collection("theatre");

const create = async (name, seatCount, movieData, status) => {
  const response = await theatreCollection.insertOne({
    name,
    seatCount,
    movieData,
    status,
  });
  return response;
};

const getAll = () => {
  return theatreCollection.find().toArray();
};

const getOneUser = ( name ) => {
  return theatreCollection.find({ name: name }).toArray();
};

const update = (name, fieldsToUpdate) => {
  return theatreCollection.updateOne(
    { name: name },
    { $set: fieldsToUpdate }
  );
};

const deleteRecord = (name) => {
  return theatreCollection.deleteOne({ name: name });
};

module.exports = {
  create,
  getAll,
  getOneUser,
  update,
  deleteRecord,
};
