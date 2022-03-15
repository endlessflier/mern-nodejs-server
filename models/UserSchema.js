const mongoose = require("mongoose");
const schema = mongoose.Schema;

const user_schema = new schema(
  {
    full_name: { type: String, default: "" },
    email: { type: String, default: "" },
    country: { type: String, default: "" },
    verification_otp: { type: String, default: "" },
    stocks: { type: Number, default: 0 },
    referal_code: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    is_delete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("users", user_schema);

module.exports = {
  Users,
};
