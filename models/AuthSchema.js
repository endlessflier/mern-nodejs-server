const mongoose = require("mongoose");
const schema = mongoose.Schema;

const auth_schema = new schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      index: true,
    },
    token: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Auth = mongoose.model("auths", auth_schema);

module.exports = {
  Auth,
};
