const Controller = require("./Controller");
const Notification = require("../models/NotificationSchema").Notification;
const Model = require("../models/Model");

class NotificationController extends Controller {
  constructor() {
    super();
  }

  async get() {
    try {
      let notificationID = this.req.params.id;
      if (notificationID == "all") {
        let notifications = await Notification.find({});
        if (notifications != null) {
          return this.res.send({
            status: 1,
            message: "all notification returned!!",
            data: notifications,
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occured!! please try again later!!",
          });
        }
      } else {
        let singleNotification = await Notification.findById(notificationID);
        if (singleNotification != null) {
          return this.res.send({
            status: 1,
            message: "single notification returned!!",
            data: singleNotification,
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occured!! please try again later!!",
          });
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

  async add() {
    try {
      let bodyData = this.req.body;
      let data = {
        notification: bodyData.notification,
      };
      let addData = await new Model(Notification).store(data);
      if (addData != null) {
        return this.res.send({
          status: 1,
          message: "notification added successfully!!",
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

  async update() {
    try {
      let bodyData = this.req.body;
      if (bodyData.is_delete) {
        let deleteResponse = await Notification.findByIdAndDelete(
          bodyData.notification_id
        );
        if (deleteResponse != null) {
          return this.res.send({
            status: 1,
            message: "notification deleted successfully!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else {
        let updateData = {
          notification: bodyData.notification,
        };
        let updateResponse = await Notification.findByIdAndUpdate(
          bodyData.notification_id,
          updateData
        );
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "notification updated successfully!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
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
}

module.exports = NotificationController;
