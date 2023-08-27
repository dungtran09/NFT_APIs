const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name."],
    },
    email: {
      type: String,
      require: [true, "Please provide your email."],
      unique: true,
      toLowercase: true,
      validate: [validator.isEmail, "Please provide valid email."],
    },
    role: {
      type: String,
      emun: ["admin", "creator", "user", "guide"],
      default: "User",
    },
    photo: String,
    password: {
      type: String,
      required: [true, "Please provide paswword."],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (pass) {
          return this.password === pass;
        },
        message: "confirm password is not match.",
      },
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  // check password modified
  if (!this.isModified("password")) return next();

  // hash password before save
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isChanged = async function (JWTTimestamp) {
  if (this.updatedAt) {
    const updateTimestamp = parseInt(this.updatedAt.getTime() / 1000, 10);
    // console.log("Time last changed password:" + updateTimestamp);
    // console.log("Time of Token created     :" + JWTTimestamp);
    return JWTTimestamp < updateTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const restToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(restToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  // console.log(restToken);
  // console.log(this.passwordResetToken);
  return restToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
