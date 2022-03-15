const mongoose = require("mongoose");
const schema = mongoose.Schema;

const notification_schema = new schema(
  {
    notification: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("notifications", notification_schema);

module.exports = {
  Notification,
};
