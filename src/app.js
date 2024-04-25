const express = require("express");
const app = express();
const { errorHandler } = require("./middlewares/error.middlewares.js");
function startApp() {
  //All Routers
  const healthcheckRouter = require("./routes/healthcheck.routes.js");

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

  app.use("/api/v1/healthcheck", healthcheckRouter);

  //error Handler
  app.use(errorHandler);
}

module.exports = { app, startApp };
