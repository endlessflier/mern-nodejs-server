const mongoose = require("mongoose");
const schema = mongoose.Schema;

const stuff_images_schema = new schema(
  {
    image_path: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const StuffImages = mongoose.model("stuff_images", stuff_images_schema);

module.exports = {
  StuffImages,
};
