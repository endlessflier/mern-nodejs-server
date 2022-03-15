const config = require("./config");
const mongoose = require("mongoose");

module.exports = function () {
  let db = mongoose
    .connect(config.DATABASE_URL, config.DATABASE_OPTIONS)
    .then(() => {
      console.log("database connected");
    });

  return db;
};
