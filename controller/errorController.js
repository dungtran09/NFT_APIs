const AppError = require("../utils/AppError");

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Server error.",
    });
  }
};

const handlerCastError = (err) => {
  let message;
  if (typeof err.value == "object") {
    message = `Invalid ${err.path}.`;
  } else {
    message = `Invalid ${err.path}: ${err.value}`;
  }
  return new AppError(message, 404);
};

const handlerValidationError = (err) => {
  const _msg = `${err._message}: `;
  const message = err.message.split(_msg).join("");
  return new AppError(message, 400);
};

const handlerDuplicateError = (err) => {
  const name = err.keyValue.name;
  const message = `There is already a name with '${name}'. Please use another name.`;
  return new AppError(message, 404);
};

const handlerJsonWebTokenError = (err) => {
  return new AppError(
    "Invalid token Or Token expored.Please login again!",
    401,
  );
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    // console.log(err.name);
    sendErrorDev(err, req, res);
  }

  if (process.env.NODE_ENV === "production") {
    // console.log(err.name);
    if (err.name === "CastError") err = handlerCastError(err);
    if (err.name === "ValidationError") err = handlerValidationError(err);
    if (err.code === 11000) err = handlerDuplicateError(err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
      err = handlerJsonWebTokenError(err);
    sendErrorProd(err, req, res);
  }

  next();
};
