const express = require("express");
const app = express();

function startApp() {
  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "50mb",
    })
  );
}

module.exports = { app, startApp };
