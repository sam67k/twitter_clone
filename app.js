const express = require("express");
const bodyParser = require("body-parser");
const expressLogger = require("express-bunyan-logger");
const router = require("./routes");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(
  expressLogger({
    excludes: [
      "headers",
      "req",
      "user-agent",
      "short-body",
      "http-version",
      "req-headers",
      "res-headers",
      "body",
      "res",
    ], // remove extra details from log
  })
);

// Test Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Twitter Clone");
});

// routes
app.use("/api", router);

// catch 404
app.use((req, res) => {
  return res.status(404).send({
    status: 404,
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  req.log.error(err);
  return res.status(err.status || 500).send({
    status: err.status || 500,
    success: false,
    message: err.message,
  });
});

module.exports = app;
