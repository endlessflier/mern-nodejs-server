const jwt = require("jsonwebtoken");
const Auth = require("../models/AuthSchema").Auth;

const isAuthorized = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.send({ status: 2, message: "unauthorized request!!" });
  }
  let isTokenExist = await Auth.find({ token: token });
  if (isTokenExist.length == 0) {
    res.send({ status: 2, message: "invalid token!!" });
  } else {
    jwt.verify(
      req.headers["x-access-token"],
      process.env.TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          res.send({ status: 2, message: "unauthorized request!!" });
        } else {
          res.user_id = decoded._id;
          next();
        }
      }
    );
  }
};

module.exports = isAuthorized;
