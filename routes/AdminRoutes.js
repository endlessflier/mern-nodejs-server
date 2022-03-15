module.exports = (app, express) => {
  const router = express.Router();

  const config = require("../configs/config");
  const SettingsController = require("../controllers/SettingsController");
  const AdminController = require("../controllers/AdminController");
  const NotificationController = require("../controllers/NotificationController");
  const AppLinksController = require("../controllers/AppLinksController");
  const StuffController = require("../controllers/StuffController");
  const UsersController = require("../controllers/UsersController");
  const TransactionController = require("../controllers/TransactionController");
  const isAuthorized = require("../services/Authenticator");

  router.post("/add_settings", isAuthorized, (req, res) => {
    let settingsObj = new SettingsController().init(req, res);
    return settingsObj.Add();
  });

  router.post("/update_settings", isAuthorized, (req, res) => {
    let settingsObj = new SettingsController().init(req, res);
    return settingsObj.Update();
  });

  router.post("/update_home_banner_image", isAuthorized, (req, res) => {
    let settingsObj = new SettingsController().init(req, res);
    return settingsObj.updateHomeBannerImage();
  });

  router.post("/add_admin", (req, res) => {
    let adminObj = new AdminController().init(req, res);
    return adminObj.add();
  });

  router.post("/admin_login", (req, res) => {
    let adminObj = new AdminController().init(req, res);
    return adminObj.login();
  });

  router.get("/admin_logout", isAuthorized, (req, res) => {
    let adminObj = new AdminController().init(req, res);
    return adminObj.logout();
  });

  router.post("/get_users", isAuthorized, (req, res) => {
    let adminObj = new AdminController().init(req, res);
    return adminObj.getUsers();
  });

  router.post("/update_profile", isAuthorized, (req, res) => {
    let adminObj = new AdminController().init(req, res);
    return adminObj.updateProfile();
  });

  router.post("/update_password", isAuthorized, (req, res) => {
    let adminObj = new AdminController().init(req, res);
    return adminObj.changePassword();
  });

  router.post("/add_notification", isAuthorized, (req, res) => {
    let notificationObj = new NotificationController().init(req, res);
    return notificationObj.add();
  });

  router.post("/update_notification", isAuthorized, (req, res) => {
    let notificationObj = new NotificationController().init(req, res);
    return notificationObj.update();
  });

  router.post("/add_app_link", isAuthorized, (req, res) => {
    let appLinksObj = new AppLinksController().init(req, res);
    return appLinksObj.add();
  });

  router.post("/update_app_link", isAuthorized, (req, res) => {
    let appLinksObj = new AppLinksController().init(req, res);
    return appLinksObj.update();
  });

  router.post("/update_home_images", isAuthorized, (req, res) => {
    let settingsObj = new SettingsController().init(req, res);
    return settingsObj.updateHomeAdvertisementImages();
  });

  router.post("/update_page_banners", (req, res) => {
    let settingsObj = new SettingsController().init(req, res);
    return settingsObj.updatePageBanners();
  });

  router.post("/add_stuff_image", isAuthorized, (req, res) => {
    let stuffObj = new StuffController().init(req, res);
    return stuffObj.addStuffImage();
  });

  router.post("/update_stuff_image", isAuthorized, (req, res) => {
    let stuffObj = new StuffController().init(req, res);
    return stuffObj.updateStuffImage();
  });

  router.post("/add_stuff_video", isAuthorized, (req, res) => {
    let stuffObj = new StuffController().init(req, res);
    return stuffObj.addStuffVideo();
  });

  router.post("/update_stuff_video", isAuthorized, (req, res) => {
    let stuffObj = new StuffController().init(req, res);
    return stuffObj.updateStuffVideos();
  });

  router.post("/block_unblock_user", isAuthorized, (req, res) => {
    let userObj = new UsersController().init(req, res);
    return userObj.BlockUnblockUser();
  });

  router.post("/delete_user", isAuthorized, (req, res) => {
    let userObj = new UsersController().init(req, res);
    return userObj.DeleteUser();
  });

  router.post("/update_user", isAuthorized, (req, res) => {
    let userObj = new UsersController().init(req, res);
    return userObj.updateUser();
  });

  router.post("/get_user_by_id", isAuthorized, (req, res) => {
    let userObj = new UsersController().init(req, res);
    return userObj.getUserById();
  });

  router.get("/get_company_transactions", isAuthorized, (req, res) => {
    let transactionsObj = new TransactionController().init(req, res);
    return transactionsObj.getCompanyTransaction();
  });

  app.use(config.API_URL, router);
};
