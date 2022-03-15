const mongoose = require("mongoose");
const schema = mongoose.Schema;

const original_app_links_schema = new schema(
  {
    app_name: { type: String, default: "" },
    app_link: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const OriginalAppLinks = mongoose.model(
  "original_app_links",
  original_app_links_schema
);

module.exports = {
  OriginalAppLinks,
};
