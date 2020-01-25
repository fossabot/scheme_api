require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const app = express();
const helmet = require("helmet");

const shiftRoutes = require("./routes/shiftRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const clientRoutes = require("./routes/clientRoutes");
const messengerRoutes = require("./routes/messengerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const templateRoutes = require("./routes/templateRoutes");
const verifyToken = require("./middlewares/verifyToken");

//DB Connect
require("./helpers").db.connect();

// Middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

// Routing
app.use("/users", userRoutes);
app.use("/shifts", verifyToken, shiftRoutes);
app.use("/requests", verifyToken, requestRoutes);
app.use("/clients", clientRoutes);
app.use("/messenger", verifyToken, messengerRoutes);
app.use("/notifications", verifyToken, notificationRoutes);
app.use("/templates", verifyToken, templateRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the schemeapp api",
    environment: process.env.NODE_ENV
  });
});

// Server init
app.listen(7070, () => {
  console.log(
    `Running | Environment : ${process.env.NODE_ENV || "Development"}`
  );
});
