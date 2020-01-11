require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const passport = require("passport");

const shiftRoutes = require("./routes/shiftRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const clientRoutes = require("./routes/clientRoutes");
const messengerRoutes = require("./routes/messengerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const serviceRoutes = require("./routes/serviceRoutes");
const templateRoutes = require("./routes/templateRoutes");
const verifyToken = require("./middlewares/verifyToken");

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(passport.initialize());
app.use(morgan("combined"));

// Test
app.get("/test", (req, res) => {
  res
    .json({
      message: "Hello"
    })
    .end();
});

// Routing
app.use("/users", userRoutes);
app.use("/shifts", verifyToken, shiftRoutes);
app.use("/requests", verifyToken, requestRoutes);
app.use("/clients", clientRoutes);
app.use("/messenger", verifyToken, messengerRoutes);
app.use("/notifications", verifyToken, notificationRoutes);
app.use("/auth", serviceRoutes);
app.use("/templates", verifyToken, templateRoutes);

// DB Connect
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  err => {
    !err
      ? console.log("Database Status: Connected")
      : console.log(`Database Status: Error ${err}`);
  }
);

// Server init
app.listen(7070, () => {
  console.log(
    `Running | Environment : ${process.env.NODE_ENV || "Development"}`
  );
});
