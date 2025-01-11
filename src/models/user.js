const mongoose = require("mongoose");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("invalid gender");
        }
      },
    },
    email: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validate.isEmail(value)) {
          throw new Error("not a Valid email " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      min: 8,
      validate(value) {
        if (!validate.isStrongPassword(value)) {
          throw new Error("Not a strong password");
        }
      },
    },
    // New fields added below
    age: {
      type: Number,
      default:0,
      min: 0, // Age should be a non-negative number
    },
    about: {
      type: String,
      default:"this is default user",
      maxLength: 500, // Optional max length for the "about" section
    },
    skills: {
      type: [String], // Array of strings to store skills
      default: [], // Default value as an empty array
      validate(value) {
        if (!Array.isArray(value)) {
          throw new Error("Skills must be an array of strings");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// Methods for the user schema
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const hashPassword = this.password;
  const isPasswordValid = await bcrypt.compare(password, hashPassword);
  return isPasswordValid;
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};
