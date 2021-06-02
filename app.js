const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./route/userRoute");

//FOR APP USE
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Route handle INITIALIZE
app.use("/api/user", userRoute);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept,Authorization"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,PUT,PATCH,POST,DELETE,OPTIONS"
//   );
//   next();
// });
//GET API INITIALIZE
app.get("/", (req, res) => {
  res.send(
    "<h1 style='color : green'> Welcome to role based authentication!</h1>"
  );
});
//default error handler
const errorHandler = (err, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json(console.log(err));
};
app.use(errorHandler);

// unHandler routes
app.all("*", (req, res) => {
  res.send({ message: " Not Found Page!!" });
});

module.exports = app;
