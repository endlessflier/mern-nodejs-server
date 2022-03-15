const mongoose = require("mongoose");
const schema = mongoose.Schema;

const transaction_schema = new schema(
  {
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    transfer_stocks: { type: Number, default: 0 },
    transaction_type: { type: String, default: "" },
    transaction_otp: { type: Number, default: 0 },
    is_transaction_verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("transactions", transaction_schema);

module.exports = {
  Transaction,
};
