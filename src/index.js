const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const { app, startApp } = require("./app.js");
const connectDB = require("./db");
const PORT = process.env.PORT;

(async () => {
  // Connect Mongodb Database
  await connectDB();

  // Start Express Server
  startApp();

  app.listen(PORT, () => {
    console.log("🚀 Server is running on port ", PORT);
  });
})();
