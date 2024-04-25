const express = require("express");
const app = express();

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

app.get("/user/hello", (req, res) => {
  res.send("Hello World");
});
module.exports = app;
