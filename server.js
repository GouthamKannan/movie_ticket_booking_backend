const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: ".env" });
const theatreRouter = require("./routes/theatre");
const userRouter = require("./routes/users");
const movieRouter = require("./routes/movie");
const bookingRouter = require("./routes/booking");
const jwt = require("jsonwebtoken");

const JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY;
var app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.cookies.session_id) {
      try {
          userDetails = jwt.verify(req.cookies.session_id, JWT_SIGNING_KEY)
          req.mailId = userDetails
      } catch (error) {
          console.error('Error in verifying JWT :: ', error)
          return res.status(401).json({ success: false, message: "Invalid session" })
      }
      next()
  }
  next()
})

app.use("/users", userRouter);
app.use("/theatre", theatreRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingRouter);


var server = app.listen(3000, () => {
  console.log(`server listening to ${server.address().port}`);
});

server.setTimeout(10000);
