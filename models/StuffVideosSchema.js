const mongoose = require("mongoose");
const schema = mongoose.Schema;

const stuff_videos_schema = new schema(
  {
    video_path: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const StuffVideos = mongoose.model("stuff_videos", stuff_videos_schema);

module.exports = {
  StuffVideos,
};
