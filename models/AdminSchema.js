const mongoose = require("mongoose");
const schema = mongoose.Schema;

const admin_schema = new schema(
  {
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("admins", admin_schema);

module.exports = {
  Admin,
};
