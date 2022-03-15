const Controller = require("./Controller");
const Admin = require("../models/AdminSchema").Admin;
const Model = require("../models/Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;
const Auth = require("../models/AuthSchema").Auth;
const Users = require("../models/UserSchema").Users;
const StockChanges = require("../models/StockChangeSchema").StockChanges;

class AdminController extends Controller {
  constructor() {
    super();
  }

  async add() {
    try {
      let bodyData = this.req.body;
      if (bodyData.secret_string == process.env.TOKEN_SECRET) {
        let isExist = await Admin.find({ username: bodyData.username });
        if (isExist.length != 0) {
          return this.res.send({
            status: 0,
            message: "admin already exist with this username",
          });
        }
        let hashedPassword = await bcrypt.hash(bodyData.password, 10);
        bodyData.password = hashedPassword;
        let addData = await new Model(Admin).store(bodyData);
        if (addData != null) {
          return this.res.send({
            status: 1,
            message: "admin created successfully!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else {
        return this.res.send({
          status: 0,
          message: "unauthorized request!!",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again later!!",
      });
    }
  }

  async login() {
    try {
      let bodyData = this.req.body;
      let isExist = await Admin.find({ username: bodyData.username }).lean();
      if (isExist.length == 0) {
        return this.res.send({
          status: 0,
          message: "invalid username",
        });
      }
      let isCorrectPassword = await bcrypt.compare(
        bodyData.password,
        isExist[0].password
      );
      if (isCorrectPassword) {
        let token = jwt.sign(isExist[0], process.env.TOKEN_SECRET, {
          expiresIn: "2d",
        });
        let authData = {
          user_id: ObjectId(isExist[0]._id),
          token: token,
        };
        let authDataAdd = await new Model(Auth).store(authData);
        let response = {
          status: 1,
          message: "logged in successfully!!",
          data: {
            username: isExist[0].username,
            password: isExist[0].password,
            first_name: isExist[0].first_name,
            last_name: isExist[0].last_name,
            token: token,
          },
        };

        if (authData != null) {
          return this.res.send(response);
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else {
        return this.res.send({
          status: 0,
          message: "incorrect password!!",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again later!!",
      });
    }
  }

  async logout() {
    try {
      let token = this.req.headers["x-access-token"];
      console.log(token);
      let deleteToken = await Auth.findOneAndDelete({ token: token });
      if (deleteToken != null) {
        return this.res.send({
          status: 1,
          message: "logout successfull!!",
        });
      } else {
        return this.res.send({
          status: 0,
          message: "some error occoured!! please try again later!!",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again later!!",
      });
    }
  }

  async getUsers() {
    try {
      let bodyData = this.req.body;
      if (!bodyData.page || !bodyData.pagesize) {
        return this.res.send({
          status: 0,
          message: "please send pagination data",
        });
      }

      let page = parseInt(bodyData.page);
      let pagesize = parseInt(bodyData.pagesize);
      let skip = (page - 1) * pagesize;

      let users = await Users.find({ is_verified: true, is_delete: false })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(pagesize);

      let total = await Users.count();

      if (users != null) {
        return this.res.send({
          status: 1,
          message: "users returned!!",
          data: users,
          total: total,
        });
      } else {
        return this.res.send({
          status: 0,
          message: "some error occoured!! please try again later!!",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again later!!",
      });
    }
  }

  async getStockChangeData() {
    try {
      let stockChangeData = await StockChanges.find({});
      if (stockChangeData != null) {
        return this.res.send({
          status: 1,
          message: "stock change data returned!!",
          data: stockChangeData,
        });
      } else {
        return this.res.send({
          status: 0,
          message: "some error occoured!! please try again",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again later!!",
      });
    }
  }

  async updateProfile() {
    try {
      let bodyData = this.req.body;
      let updateProfile = await Admin.updateOne({}, bodyData);
      if (updateProfile != null) {
        return this.res.send({
          status: 1,
          message: "profile updated successfully!!",
        });
      } else {
        return this.res.send({
          status: 0,
          message: "some error occoured!! please try again later!!",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again later!!",
      });
    }
  }

  async changePassword() {
    try {
      let bodyData = this.req.body;
      let password = bodyData.password;
      let oldPassword = bodyData.old_password;
      let admin = await Admin.findOne({ username: bodyData.username });
      let isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        admin.password
      );
      if (!isOldPasswordCorrect) {
        return this.res.send({
          status: 0,
          message: "old password is incorrect!!",
        });
      }
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);
      let updatePassword = await Admin.updateOne(
        { username: bodyData.username },
        { password: hashedPassword }
      );
      if (updatePassword != null) {
        return this.res.send({
          status: 1,
          message: "password changed successfully!!",
        });
      } else {
        return this.res.send({
          status: 0,
          message: "some error occoured!! please try again later!!",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again late!!",
      });
    }
  }
}

module.exports = AdminController;
