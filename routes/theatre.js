const express = require("express");
const theatreController = require("../controller/theatre");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { name, seatCount, movieData } = req.body;
  if (!name || !seatCount || !movieData) {
    return res.json({
      success: false,
      message: "name, seatcount and moviedata are required",
    });
  }
  try {
    theatres = await theatreController.getOneUser(name);
    if (theatres.length) {
      return res
        .status(200)
        .json({ success: false, message: "Given theatre name already exists" });
    }

    await theatreController.create(name, seatCount, movieData, 1);
    return res
      .status(200)
      .json({ success: true, message: "threate created successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in creating the theatre :: ${error.message}`,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const theatres = await theatreController.getAll();
    return res.status(200).json({ theatres, message: "fetched successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching the theatres data :: ${error.message}`,
    });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const theatre = await theatreController.getOneUser(req.params["name"]);
    return res.status(200).json({ theatre, message: "fetched successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching the theatres data :: ${error.message}`,
    });
  }
});

router.get("/get_theatre_list/:movie", async (req, res) => {
  try {
    var theatreList = [];
    const movie = req.params["movie"];
    const theatres = await theatreController.getAll();
    theatres.forEach((theatre) => {
      var availableSlots = [];
      for (var time in theatre.movieData) {
        if (
          movieData[time].name === movie &&
          theatre.seatCount >
            theatre.movieData[time].bookedSeats.length +
              theatre.movieData[time].blockedSeats.length
        ) {
          availableSlots.add(time);
        }
      }
      theatreName = theatre.name;
      theatreList.add({ theatreName: availableSlots });
    });
    return res.status(200).json({ theatreList, message: "fetched successfully" });
  } catch (error) {
    return res
    .status(500)
    .json({ success: false, message: "Error in getting the theatre data" });
  }
});

router.delete("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ message: "Bad requests, name is not found or not valid" });
  }
  try {
    const response = await theatreController.deleteRecord(name);
    return res.json({ success: true, message: "deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in deleting the theatre data" });
  }
});

router.put("/", async (req, res) => {
  const { name, fieldsToUpdate } = req.body;
  if (!name || !fieldsToUpdate) {
    return res.status(400).json({
      message:
        "Bad requests, theatre name and fieldsToUpdate is not found or not valid",
    });
  }
  try {
    const response = await theatreController.update(name, fieldsToUpdate);
    return res.json({ success: true, message: "updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in updating the data" });
  }
});

module.exports = router;