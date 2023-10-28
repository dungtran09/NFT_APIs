const asyncErrorHandler = require("../utils/asyncErrorHandler");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

// GET USERS
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

// GET USER
exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(`User ID: ${req.params.id} is not found.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// UPDATE USER
exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  if (
    req.body.hasOwnProperty("password") ||
    req.body.hasOwnProperty("passwordConfirm")
  ) {
    const link = "/api/v1/users/updatePassword";
    return next(
      new AppError(
        `You can not update password. Using "${link}" to update Password.`,
        404,
      ),
    );
  }

  if (req.body.hasOwnProperty("role")) {
    return next(
      new AppError("You can not permission to update the role.", 404),
    );
  }

  const user = await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError(`User ID: ${req.user.id} is not found.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// DELETE USER
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  if (!user) {
    return next(new AppError(`User ID: ${req.params.id} is not found.`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
