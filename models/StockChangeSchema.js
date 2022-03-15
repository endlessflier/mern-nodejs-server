const mongoose = require("mongoose");
const schema = mongoose.Schema;

const stock_change_schema = new schema(
  {
    previous_price: { type: Number, default: 0 },
    current_price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const StockChanges = mongoose.model("stock_changes", stock_change_schema);

module.exports = {
  StockChanges,
};
