const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const fs = require("fs");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

// CREATE TOKEN
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SCRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SEND TOKEN
const sendToken = (res, token, user, statusCode) => {
  const cookieOptions = {
    expries: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPRIES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

// SIGN USER
exports.signUp = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = createToken(newUser._id);
  sendToken(res, token, newUser, 201);
});

// LOGIN USER
exports.logIn = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email);
  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 404));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Email or password not correct.", 401));
  }

  const token = createToken(user.id);

  // save token in to file TOKEN.txt
  try {
    fs.writeFileSync(`${__dirname}/../test_api/nfts/config/TOKEN.txt`, token);
    console.log("Write Reset Token Successfully!");
  } catch (error) {
    console.log(error.message);
  }
  sendToken(res, token, user, 200);
});

// PROTECTING DATA
exports.protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authentication;
  let token;

  // GET TOKEN
  if (testToken || testToken?.startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Your are not logged into get access.", 401));
  }

  // VALIDATE TOKEN
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SCRET,
  );

  const user = await User.findById({ _id: decodedToken.id });

  // CHECK USER EXIST OR NOT
  if (!user) {
    return next(
      new AppError("User belonging to this token no longer exist.", 401),
    );
  }

  // CHECK ANY INFO CHANGED
  const isChanged = await user.isChanged(decodedToken.iat);
  if (isChanged) {
    return next(
      new AppError("There are some changed recently. Please Login again.", 401),
    );
  }

  req.user = user;

  next();
});

// RESTRIC ACCTION
exports.restrict = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permision to perform this acction.", 403),
      );
    }
    next();
  };
};

// FORGOT PASSWORD
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // Get user
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new AppError("Email not valid. Please provide correct Email.", 400),
    );
  }

  // Create token for user
  const resetToken = user.createPasswordResetToken();

  // save token
  try {
    fs.writeFileSync(
      `${__dirname}/../test_api/users/config/resetPasswordToken.txt`,
      resetToken,
    );
    console.log("Write Password Reset Token Successfully!");
  } catch (error) {
    console.log(error.message);
  }

  await user.save({ validateBeforeSave: false });

  // Send email back to user
  const resetUrl = `${req.protocol}://${req.get(
    "host",
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `We are recived a reset password request. Click link below to reset your password.\nLINK: ${resetUrl}\n\nThis link reset will be expried in 10 minutes.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password.",
      message: message,
    });

    res.status(200).json({
      status: "success",
      mesasge: "Password reset link sended to the email.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was and error sending password reset email. Try again later.",
        500,
      ),
    );
  }
});

// RESET PASSWORD
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // return error if user not found
  if (!user) {
    return next(new AppError("Token is invalid or expried!", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save({ validateBeforeSave: true });

  const loginToken = createToken(user._id);

  sendToken(res, loginToken, user, 200);
});

// UPDATE PASSWORD
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById({ _id: req.user.id }).select("+password");
  console.log(user);
  console.log(req.body);
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Password invalid.", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save({ validateBeforeSave: true });

  const loginToken = createToken(user_id);
  sendToken(res, loginToken, user, 200);
});
