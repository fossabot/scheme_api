require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const helpers = require("./helpers");

const shiftRoutes = require("./routes/shiftRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const clientRoutes = require("./routes/clientRoutes");
const messengerRoutes = require("./routes/messengerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const templateRoutes = require("./routes/templateRoutes");
const reportRoutes = require("./routes/reportRoutes");

const verifyToken = require("./middlewares/verifyToken");

helpers.db.connect();

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
app.use("/reports", reportRoutes);

// Initial routing
app.get("/", (req, res) => {
  try {
    helpers.success(res, {
      title: "Welcome to schemeapp api",
      message: "API Running"
    });
  } catch (error) {
    helpers.error(res, {
      title: "Error when running request",
      message: error
    });
  }
});

// Health route
app.get("/healthcheck", (req, res) => {
  try {
    console.log(res.status);
    let healthCheckObject = {
      healthy: res.statusCode == 200 ? true : false,
      status: res.statusCode,
      uptime: process.uptime(),
      env: process.env.NODE_ENV || "Development"
    };
    helpers.success(res, healthCheckObject);
  } catch (error) {
    helpers.error(res, error);
  }
});

// Server init
app.listen(7070, () => {
  console.log(
    `Running | Environment : ${process.env.NODE_ENV || "Development"}`
  );
});
