const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// HANDLER ERROR SYNTAX,...: uncaughtException
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaughtException Shutting down application...");
  process.exit(1);
});

// CONFIG ENV NODE
dotenv.config({ path: "./config.env" });

// CONNECT DB
mongoose
  .connect(process.env.DB_REMOTE_STR, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("Database connect successfully.");
  });

// CREATE LOCAL SERVER
const PORT = process.env.PORT || 8001;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...Width '${app.get("env")}' mode.`);
});

// HANDLER ERROR  CONNECT DB: unhandledRejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandledRejection Shutting down application...");
  server.close(() => {
    process.exit(1);
  });
});
