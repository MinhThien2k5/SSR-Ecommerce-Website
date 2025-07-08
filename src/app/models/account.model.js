const mongoose = require("mongoose");

const generate = require("../../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    token: {
      type: String,
      default: generate.generateRandomString(32),
    },
    avatar: {
      type: String,
      default: "",
    },
    role_id: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
