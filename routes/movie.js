const express = require("express");
const movieController = require("../controller/movie");

const router = express.Router();
const JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY;

router.post("/create", async (req, res) => {
  const { name, genre, duration, photo } = req.body;
  if (!name || !genre || !duration || !photo) {
    return res.json({
      success: false,
      message: "name, genre, duration and photo are required",
    });
  }
  try {
    movies = await movieController.getOneUser(name);
    if (movies.length) {
      return res
        .status(200)
        .json({ success: false, message: "Given movie name already exists" });
    }

    await movieController.create(name, genre, duration, photo, 1);
    return res
      .status(200)
      .json({ success: true, message: "movie created successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in creating the movie :: ${error.message}`,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const theatres = await movieController.getAll();
    return res.status(200).json({ theatres, message: "fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: `Error in fetching the movies data :: ${error.message}`,
      });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const movie = await movieController.getOneUser(req.params["name"]);
    return res.status(200).json({ theatre, message: "fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: `Error in fetching the movie data :: ${error.message}`,
      });
  }
});

router.delete("/", async (req,res) => {
    const {name} = req.body
    if (!name) {
        return res.status(400).json({ message: "Bad requests, name is not found or not valid" })
    }
    try {
        const response = await movieController.deleteRecord(name)
        return res.json({success: true, message: "deleted successfully" })
    } catch (error) {
        return res.status(500).json({success: false, message: "Error in deleting the movie data" })
    }
})

router.put('/', async (req, res) => {
    const { name, fieldsToUpdate } = req.body
    if (!name || !fieldsToUpdate) {
        return res.status(400).json({ message: "Bad requests, theatre name and fieldsToUpdate is not found or not valid" })
    }
    try {
        const response = await movieController.update(name, fieldsToUpdate)
        return res.json({success: true, message: "updated successfully" })
    } catch (error) {
        return res.status(500).json({success: false, message: "Error in updating the data" })
    }
})

module.exports = router;