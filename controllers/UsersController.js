const Controller = require("./Controller");
const Users = require("../models/UserSchema").Users;
const Settings = require("../models/SettingsSchema").Settings;
const Transaction = require("../models/TransactionSchema").Transaction;
const Model = require("../models/Model");
const Email = require("../services/Email");
class UsersController extends Controller {
  constructor() {
    super();
  }

  async add() {
    try {
      let bodyData = this.req.body;
      let existUser = await Users.find({
        email: bodyData.email,
        is_delete: false,
      });
      console.log(existUser);
      if (existUser.length == 0) {
        return this.res.send({
          status: 0,
          message: "invalid email!!",
        });
      } else if (existUser[0].is_verified) {
        return this.res.send({
          status: 0,
          message: "A user already exist with this email address!!",
        });
      } else if (bodyData.otp == existUser[0].verification_otp) {
        let settings = await Settings.findOne({});
        bodyData["referal_code"] = generateReferralCode();
        bodyData["is_verified"] = true;
        bodyData["stocks"] = settings.free_stocks_to_give;
        let updateUser = await Users.findByIdAndUpdate(
          existUser[0].id,
          bodyData
        );
        if (bodyData.hasOwnProperty("refer_by")) {
          let refererUser = await Users.findOne({
            referal_code: bodyData.refer_by,
          });
          let updateStocks = await Users.findByIdAndUpdate(refererUser.id, {
            $inc: { stocks: settings.referal_stocks },
          });
          let transactionData = {
            sender_id: existUser[0].id,
            receiver_id: refererUser.id,
            transfer_stocks: settings.referal_stocks,
            transaction_type: "refer",
            is_transaction_verified: true,
          };
          let makeTransaction = await new Model(Transaction).store(
            transactionData
          );
        }
        if (updateUser != null) {
          return this.res.send({
            status: 1,
            message: `You got ${settings.free_stocks_to_give} shares of Empty Pages`,
            referal_code: bodyData.referal_code,
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
          message: "invalid otp!!",
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

  async sendVerificationOtp() {
    try {
      let bodyData = this.req.body;
      let existUser = await Users.find({
        email: bodyData.email,
        is_delete: false,
      });
      if (existUser.length != 0) {
        return this.res.send({
          status: 0,
          message: "A user with this email already exists!!",
        });
      }
      let email = new Email();
      let code = await email.sendVerificationOtp(bodyData.email);
      let userData = {
        email: bodyData.email,
        verification_otp: code,
      };
      let addUser = await new Model(Users).store(userData);
      if (addUser != null) {
        return this.res.send({
          status: 1,
          message: "verification code sent!!",
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

  async getUserByEmail() {
    try {
      let bodyData = this.req.body;
      let user = await Users.findOne({
        email: bodyData.email,
        is_delete: false,
      });
      console.log(user);
      if (user != null) {
        if (user.is_blocked) {
          return this.res.send({
            status: 0,
            message: "This email has been blocked!! Please contact the admin.",
          });
        } else {
          return this.res.send({
            status: 1,
            message: "user data returned!!",
            data: user,
          });
        }
      } else {
        return this.res.send({
          status: 0,
          message: "no user found with this email!!",
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

  async BlockUnblockUser() {
    try {
      let bodyData = this.req.body;
      let updateUser = await Users.findByIdAndUpdate(bodyData.user_id, {
        is_blocked: bodyData.status,
      });
      if (updateUser != null) {
        return this.res.send({
          status: 1,
          message: `User successfully ${
            bodyData.status ? "blocked" : "unblocked"
          }!!`,
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

  async DeleteUser() {
    try {
      let bodyData = this.req.body;
      let deleteUser = await Users.findByIdAndUpdate(bodyData.user_id, {
        is_delete: true,
      });
      if (deleteUser != null) {
        return this.res.send({
          status: 1,
          message: "User deleted successfully!!",
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

  async updateUser() {
    try {
      let bodyData = this.req.body;
      let update = await Users.findByIdAndUpdate(bodyData.user_id, bodyData);
      if (update != null) {
        return this.res.send({
          status: 1,
          message: "User updated successfully!!",
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

  async getUserById() {
    try {
      let bodyData = this.req.body;
      let user = await Users.findById(bodyData.user_id);
      if (user != null) {
        return this.res.send({
          status: 1,
          message: "user returned!!",
          data: user,
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
}

function generateReferralCode() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = UsersController;
