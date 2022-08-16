const { model, Schema } = require("mongoose");

const appUserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  firstname: String,
  lastname: String,
  enable: Boolean,
  locked: Boolean,
  lastLogin: String,
  role: String,
  modifiedAt: String,
});

module.exports = model("AppUser", appUserSchema);
