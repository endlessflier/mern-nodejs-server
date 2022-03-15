class Aggregation {
  constructor(collection) {
    this.collection = collection;
  }

  getStockData() {
    return new Promise((resolve, reject) => {
      this.collection.aggregate(
        [
          {
            $match: {
              is_verified: true,
              is_delete: false,
            },
          },
          {
            $group: {
              _id: "",
              total_stock_holders: { $sum: 1 },
              total_stocks_raised: { $sum: "$stocks" },
            },
          },
        ],
        (err, data) => {
          if (err) {
            reject(err);
          }
          if (data) {
            resolve(data);
          }
        }
      );
    });
  }

  getStockHoldersByCountry() {
    return new Promise((resolve, reject) => {
      this.collection.aggregate(
        [
          {
            $match: {
              is_verified: true,
              is_delete: false,
            },
          },
          {
            $group: {
              _id: "$country",
              total_stock_holders: { $sum: 1 },
            },
          },
          {
            $sort: {
              total_stock_holders: -1,
            },
          },
        ],
        (err, data) => {
          if (err) {
            reject(err);
          }
          if (data) {
            resolve(data);
          }
        }
      );
    });
  }

  getReceivedStocks(filter) {
    return new Promise((resolve, reject) => {
      this.collection.aggregate(
        [
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "users",
              let: { userId: "$sender_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$userId"] },
                        { $eq: ["$is_verified", true] },
                        { $eq: ["$is_delete", false] },
                      ],
                    },
                  },
                },
              ],
              as: "senderData",
            },
          },
          {
            $unwind: {
              path: "$senderData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              sender: { $first: "$senderData" },
              transfer_stocks: { $first: "$transfer_stocks" },
              transaction_type: { $first: "$transaction_type" },
              createdAt: { $first: "$createdAt" },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
        (err, data) => {
          if (err) {
            reject(err);
          }
          if (data) {
            console.log(data);
            resolve(data);
          }
        }
      );
    });
  }

  getTransactionHistory(filter) {
    return new Promise((resolve, reject) => {
      this.collection.aggregate(
        [
          {
            $match: filter,
          },
          {
            $lookup: {
              from: "users",
              let: { userId: "$receiver_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$userId"] },
                        { $eq: ["$is_verified", true] },
                        { $eq: ["$is_delete", false] },
                      ],
                    },
                  },
                },
              ],
              as: "receiverData",
            },
          },
          {
            $unwind: {
              path: "$receiverData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              receiver: { $first: "$receiverData" },
              transfer_stocks: { $first: "$transfer_stocks" },
              transaction_type: { $first: "$transaction_type" },
              createdAt: { $first: "$createdAt" },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
        (err, data) => {
          if (err) {
            reject(err);
          }
          if (data) {
            console.log(data);
            resolve(data);
          }
        }
      );
    });
  }

  getCompanyTransactions() {
    return new Promise((resolve, reject) => {
      this.collection.aggregate(
        [
          {
            $match: {
              transaction_type: "company",
            },
          },
          {
            $lookup: {
              from: "users",
              let: { userId: "$sender_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$_id", "$$userId"] },
                        { $eq: ["$is_verified", true] },
                        { $eq: ["$is_delete", false] },
                      ],
                    },
                  },
                },
              ],
              as: "senderData",
            },
          },
          {
            $unwind: {
              path: "$senderData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "$_id",
              sender_name: { $first: "$senderData.full_name" },
              sender_email: { $first: "$senderData.email" },
              transfer_stocks: { $first: "$transfer_stocks" },
              transaction_type: { $first: "$transaction_type" },
              createdAt: { $first: "$createdAt" },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
        (err, data) => {
          if (err) {
            reject(err);
          }
          if (data) {
            console.log(data);
            resolve(data);
          }
        }
      );
    });
  }
}

module.exports = Aggregation;
