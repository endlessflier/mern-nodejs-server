const Controller = require("./Controller");
const Transaction = require("../models/TransactionSchema").Transaction;
const Users = require("../models/UserSchema").Users;
const Model = require("../models/Model");
const Aggregation = require("../models/Aggregation");
const Email = require("../services/Email");
const ObjectId = require("mongodb").ObjectId;

class TransactionController extends Controller {
  constructor() {
    super();
  }

  async sendTransactionOtp() {
    try {
      let bodyData = this.req.body;
      let sender = await Users.findOne({
        email: bodyData.sender_email,
        is_verified: true,
        is_delete: false,
      });
      if (sender == null) {
        return this.res.send({
          status: 0,
          message: "Sender email incorrect!!",
        });
      }
      if (bodyData.transfer_stocks > sender.stocks) {
        return this.res.send({
          status: 0,
          message: "You dont't have enough stocks to transfer!!",
        });
      }
      if (bodyData.transfer_type == "company") {
        if (sender != null && !sender.is_blocked) {
          let email = new Email();
          let code = await email.sendTransactionOtp(bodyData.sender_email);
          let transactionData = {
            sender_id: sender._id,
            transfer_stocks: bodyData.transfer_stocks,
            transaction_type: "company",
            transaction_otp: code,
          };
          let transaction = await new Model(Transaction).store(transactionData);
          if (transaction != null) {
            return this.res.send({
              status: 1,
              message: "otp sent!!",
              data: transaction,
            });
          } else {
            return this.res.send({
              status: 0,
              message: "some error occoured!! please try again later!!",
            });
          }
        } else if (sender != null && sender.is_blocked) {
          return this.res.send({
            status: 0,
            message:
              "You have been blocked. Please contact the admin to start transferring stocks again!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else {
        let receiver = await Users.findOne({
          email: bodyData.receiver_email,
          is_verified: true,
          is_delete: false,
        });
        if (!receiver) {
          return this.res.send({
            status: 0,
            message: "Receiver email incorrect!!",
          });
        } else if (sender.is_blocked) {
          return this.res.send({
            status: 0,
            message:
              "You have been blocked. Please contact the admin to start transferring stocks again!!",
          });
        } else if (receiver.is_blocked) {
          return this.res.send({
            status: 0,
            message:
              "The receiver has been blocked. You cannot transfer stocks to this email address!!",
          });
        } else {
          let email = new Email();
          let code = await email.sendTransactionOtp(bodyData.sender_email);
          let transactionData = {
            sender_id: sender._id,
            receiver_id: receiver._id,
            transfer_stocks: bodyData.transfer_stocks,
            transaction_type: "private",
            transaction_otp: code,
          };
          let transaction = await new Model(Transaction).store(transactionData);
          if (transaction != null) {
            return this.res.send({
              status: 1,
              message: "otp sent!!",
              data: transaction,
            });
          } else {
            return this.res.send({
              status: 0,
              message: "some error occoured!! please try again later!!",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please try again later!!",
      });
    }
  }

  async makeTransaction() {
    try {
      let bodyData = this.req.body;
      let transaction = await Transaction.findById(bodyData.transaction_id);
      if (transaction.is_transaction_verified) {
        return this.res.send({
          status: 0,
          message: "Transaction already completed!!",
        });
      }
      if (transaction != null) {
        if (bodyData.otp == transaction.transaction_otp) {
          if (transaction.transaction_type == "private") {
            let updateBuyerStocks = await Users.findByIdAndUpdate(
              transaction.receiver_id,
              { $inc: { stocks: transaction.transfer_stocks } }
            );
          }
          let updateUserStocks = await Users.findByIdAndUpdate(
            transaction.sender_id,
            { $inc: { stocks: -transaction.transfer_stocks } }
          );
          let updateTransaction = await Transaction.findByIdAndUpdate(
            bodyData.transaction_id,
            { is_transaction_verified: true }
          );
          let filter = {
            sender_id: ObjectId(transaction.sender_id),
            is_transaction_verified: true,
          };
          let transactionHistory = await new Aggregation(
            Transaction
          ).getTransactionHistory(filter);
          if (updateTransaction != null) {
            return this.res.send({
              status: 1,
              message: "Transaction Completed Successfully!!",
              transaction_history: transactionHistory,
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
            message: "incorrect OTP!!",
          });
        }
      } else {
        return this.res.send({
          status: 0,
          message: "invalid transaction id!!",
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

  async getReceivedTransactions() {
    try {
      let bodyData = this.req.body;
      let user = await Users.findById(bodyData.user_id);
      if (!user) {
        return this.res.send({
          status: 0,
          message: "No user found by this email address",
        });
      }
      let filter = {
        receiver_id: ObjectId(bodyData.user_id),
        is_transaction_verified: true,
      };
      let receivedStocks = await new Aggregation(Transaction).getReceivedStocks(
        filter
      );
      if (receivedStocks != null) {
        return this.res.send({
          status: 1,
          message: "received stock data sent!!",
          data: receivedStocks,
        });
      } else {
        this.res.send({
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

  async getCompanyTransaction() {
    try {
      let companyTransactions = await new Aggregation(
        Transaction
      ).getCompanyTransactions();
      if (companyTransactions != null) {
        return this.res.send({
          status: 1,
          message: "company transactions returned!!",
          data: companyTransactions,
        });
      } else {
        return this.res.send({
          status: 0,
          message: "some error occoured!! please trya again later!!",
        });
      }
    } catch (error) {
      console.log(error);
      return this.res.send({
        status: 0,
        message: "some error occoured!! please trya again later!!",
      });
    }
  }
}

module.exports = TransactionController;
