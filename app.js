const express = require("express");
const morgan = require("morgan");
const nftsRouter = require("./routers/nftsRouter");
const usersRouter = require("./routers/usersRouter");
const AppError = require("./utils/AppError");
const globalErrorController = require("./controller/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");

const app = express();
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too maty request from this ID. Try again late!",
});

// DATA SANITIZATION WHEN DETECT QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION WHENT DETECT SCRIPT XSS
app.use(xssClean());

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      "duration",
      "dificulty",
      "maxGroupSize",
      "price",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  }),
);

//SECURE HEADER HHTP
app.use(helmet());

// LIMIT RATE
app.use("/api", limiter);

// DISPLAY INFO REQUEST
app.use(morgan("dev"));

// SAVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nfts-data/img`));

// ROUTERs
app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Url ${req.originalUrl} is not found.`, 404));
});

// Handler Global Error
app.use(globalErrorController);

module.exports = app;
