const express = require("express");
const bookingController = require("../controller/booking");
const theatreController = require("../controller/theatre");

const router = express.Router();

router.post("/checkout", async (req, res) => {
  const {
    userName,
    theatreName,
    movieName,
    timeSlot,
    seatNumbers,
    bookedTime,
  } = req.body;
  if (
    !userName ||
    !theatreName ||
    !movieName ||
    !timeSlot ||
    !seatNumbers ||
    !bookedTime
  ) {
    return res.json({
      success: false,
      message: "all data are required",
    });
  }
try {
    const theatre = await theatreController.getOneUser(theatreName);
    movieData = theatre.movieData;
  
    //check selected seats are blocked
    blocked = seatNumbers.filter((el) => {
      return movieData[timeSlot][blockedSeats].indexOf(el) > 0;
    });
    //check selected seats are blocked
    booked = seatNumbers.filter((el) => {
      return movieData[timeSlot][bookedSeats].indexOf(el) > 0;
    });
  
    if (blocked.length || booked.length)
      return res
        .status(200)
        .json({
          success: false,
          message: "selected seats are already booked/blocked",
        });
  
    movieData[timeSlot][blockedSeats] =
      movieData[timeSlot][blockedSeats].concat(seatNumbers);

      await theatreController.update(theatreName, movieData);
      return res
      .status(200)
      .json({ success: true, message: "seats are blocked successfully" });
} catch (error) {
    return res.status(500).json({
        success: false,
        message: `Error in blocking seats :: ${error.message}`,
      });
}
});

router.post("/payment", async (req, res) => {
  const {
    userName,
    theatreName,
    movieName,
    timeSlot,
    seatNumbers,
    bookedTime,
  } = req.body;
  if (
    !userName ||
    !theatreName ||
    !movieName ||
    !timeSlot ||
    !seatNumbers ||
    !bookedTime
  ) {
    return res.json({
      success: false,
      message: "all data are required",
    });
  }
  try {
    const theatre = await theatreController.getOneUser(theatreName);
    movieData = theatre.movieData;

    //check selected seats are blocked
    notBlocked = seatNumbers.filter((el) => {
      return movieData[timeSlot][blockedSeats].indexOf(el) < 0;
    });
    if (notBlocked.length) {
      return res
        .status(200)
        .json({ success: false, message: "seats are not blocked" });
    }

    return res
    .status(200)
    .json({ success: true, message: "seats are blocked" });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in blocking seats :: ${error.message}`,
    });
  }
});

router.post("/paymentSuccessful", async (req, res) => {
  const {
    userName,
    theatreName,
    movieName,
    timeSlot,
    seatNumbers,
    bookedTime,
  } = req.body;
  if (
    !userName ||
    !theatreName ||
    !movieName ||
    !timeSlot ||
    !seatNumbers ||
    !bookedTime
  ) {
    return res.json({
      success: false,
      message: "all data are required",
    });
  }
  try {
    const theatre = await theatreController.getOneUser(theatreName);
    movieData = theatre.movieData;
    movieData[timeSlot][bookedSeats] =
      movieData[timeSlot][bookedSeats].concat(seatNumbers);
    movieData[timeSlot][blockedSeats] = movieData[timeSlot][
      blockedSeats
    ].filter((el) => {
      return seatNumbers.indexOf(el) < 0;
    });

    await theatreController.update(theatreName, movieData);

    await bookingController.create(
      userName,
      theatreName,
      movieName,
      timeSlot,
      seatNumbers,
      bookedTime
    );
    return res
      .status(200)
      .json({ success: true, message: "seats booked successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in booking seats :: ${error.message}`,
    });
  }
});

router.post("/paymentFailure", async (req, res) => {
  const {
    userName,
    theatreName,
    movieName,
    timeSlot,
    seatNumbers,
    bookedTime,
  } = req.body;
  if (
    !userName ||
    !theatreName ||
    !movieName ||
    !timeSlot ||
    !seatNumbers ||
    !bookedTime
  ) {
    return res.json({
      success: false,
      message: "all data are required",
    });
  }
  try {
    const theatre = await theatreController.getOneUser(theatreName);
    movieData = theatre.movieData;
    movieData[timeSlot][blockedSeats] = movieData[timeSlot][
      blockedSeats
    ].filter((el) => {
      return seatNumbers.indexOf(el) < 0;
    });

    await theatreController.update(theatreName, movieData);
    return res
      .status(200)
      .json({ success: true, message: "updated seats successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in updating seats :: ${error.message}`,
    });
  }
});

router.get("/", async (req, res) => {
    try {
      const bookingDetails = await bookingController.getAll();
      return res.status(200).json({ bookingDetails, message: "fetched successfully" });
    } catch (error) {
      return res.status(500).json({
        message: `Error in fetching the booking details :: ${error.message}`,
      });
    }
  });
  
  router.get("/:name", async (req, res) => {
    try {
      const bookingDetails = await bookingController.getOneUser(req.params["userName"]);
      return res.status(200).json({ bookingDetails, message: "fetched successfully" });
    } catch (error) {
      return res.status(500).json({
        message: `Error in fetching the booking details :: ${error.message}`,
      });
    }
  });

module.exports = router;