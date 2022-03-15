const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("./configs/mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

dotenv.config();
mongoose();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`server successfully running on port: ${process.env.PORT}`);
});

require("./routes/CommonRoutes")(app, express);
require("./routes/AdminRoutes")(app, express);

server.listen(process.env.PORT, () => {
  console.log(`server running on port: ${process.env.PORT}`);
});
