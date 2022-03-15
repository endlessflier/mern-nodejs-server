const Controller = require("./Controller");
const Aggregation = require("../models/Aggregation");
const Users = require("../models/UserSchema").Users;

class StockController extends Controller {
  constructor() {
    super();
  }

  async getStockData() {
    try {
      let stockData = await new Aggregation(Users).getStockData();
      if (stockData != null) {
        this.res.send({
          status: 1,
          message: "stock data returned!!",
          data: stockData[0],
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

  async getStockHoldersByCountry() {
    try {
      let stockHolderByCountry = await new Aggregation(
        Users
      ).getStockHoldersByCountry();
      if (stockHolderByCountry != null) {
        return this.res.send({
          status: 1,
          message: "stock holders by country returned!!",
          data: stockHolderByCountry,
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

module.exports = StockController;
