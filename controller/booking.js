const { client: mongoClient } = require("../models/mongodb");

const dbConnection = mongoClient.db("ticket_booking");
const usersCollection = dbConnection.collection("theatre");
const ticketHistoryCollection = dbConnection.collection("ticket_history");

const create = async (
  userName,
  theatreName,
  movieName,
  timeSlot,
  seatNumbers,
  bookedTime
) => {
  const response = await theatreCollection.insertOne({
    userName,
    theatreName,
    movieName,
    timeSlot,
    seatNumbers,
    bookedTime,
  });
  return response;
};

const getAll = () => {
    return theatreCollection.find().toArray();
  };
  
  const getOneUser = ( userName ) => {
    return theatreCollection.find({ userName: userName }).toArray();
  };

module.exports = {
    create,
    getAll,
    getOneUser
  };