module.exports = (app, express) => {
  const router = express.Router();

  const config = require("../configs/config");
  const SettingsController = require("../controllers/SettingsController");
  const UsersController = require("../controllers/UsersController");
  const AdminController = require("../controllers/AdminController");
  const NotificationController = require("../controllers/NotificationController");
  const AppLinksController = require("../controllers/AppLinksController");
  const StockController = require("../controllers/StockController");
  const TransactionController = require("../controllers/TransactionController");
  const StuffController = require("../controllers/StuffController");

  router.post("/get_settings", (req, res) => {
    let settingsObj = new SettingsController().init(req, res);
    return settingsObj.Get();
  });

  router.post("/send_verification_otp", (req, res) => {
    let usersObj = new UsersController().init(req, res);
    return usersObj.sendVerificationOtp();
  });

  router.post("/add_user", (req, res) => {
    let usersObj = new UsersController().init(req, res);
    return usersObj.add();
  });

  router.post("/get_stock_change_data", (req, res) => {
    let adminObj = new AdminController().init(req, res);
    return adminObj.getStockChangeData();
  });

  router.get("/get_notifications/:id", (req, res) => {
    let notificationObj = new NotificationController().init(req, res);
    return notificationObj.get();
  });

  router.get("/get_app_links/:id", (req, res) => {
    let appLinksObj = new AppLinksController().init(req, res);
    return appLinksObj.get();
  });

  router.get("/get_stock_data", (req, res) => {
    let stockObj = new StockController().init(req, res);
    return stockObj.getStockData();
  });

  router.get("/get_stock_holders_by_country", (req, res) => {
    let stockObj = new StockController().init(req, res);
    return stockObj.getStockHoldersByCountry();
  });

  router.post("/get_user_by_email", (req, res) => {
    let usersObj = new UsersController().init(req, res);
    return usersObj.getUserByEmail();
  });

  router.post("/send_transaction_otp", (req, res) => {
    let transactionObj = new TransactionController().init(req, res);
    return transactionObj.sendTransactionOtp();
  });

  router.post("/make_transaction", (req, res) => {
    let transactionObj = new TransactionController().init(req, res);
    return transactionObj.makeTransaction();
  });

  router.post("/get_received_transactions", (req, res) => {
    let transactionObj = new TransactionController().init(req, res);
    return transactionObj.getReceivedTransactions();
  });

  router.get("/get_stuff_images", (req, res) => {
    let stuffObj = new StuffController().init(req, res);
    return stuffObj.getStuffImages();
  });

  router.get("/get_stuff_videos/:id", (req, res) => {
    let stuffObj = new StuffController().init(req, res);
    return stuffObj.getStuffVideos();
  });

  app.use(config.API_URL, router);
};
