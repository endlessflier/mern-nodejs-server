const Controller = require("./Controller");
const OriginalAppLinks =
  require("../models/OriginalAppLinksSchema").OriginalAppLinks;
const Model = require("../models/Model");

class AppLinksController extends Controller {
  constructor() {
    super();
  }

  async add() {
    try {
      let bodyData = this.req.body;
      let addApp = await new Model(OriginalAppLinks).store(bodyData);
      if (addApp != null) {
        return this.res.send({
          status: 1,
          message: "app link added sucessfully!!",
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

  async get() {
    try {
      let { id } = this.req.params;
      let appLinks;
      if (id == "all") {
        appLinks = await OriginalAppLinks.find({});
      } else {
        appLinks = await OriginalAppLinks.findById(id);
      }
      if (appLinks != null) {
        return this.res.send({
          status: 1,
          message: "app links returned!!",
          data: appLinks,
        });
      } else {
        return this.res.send({
          status: 0,
          message: 'some error occoured!! please try again later!!"',
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
        let deleteResponse = await OriginalAppLinks.findByIdAndDelete(
          bodyData.app_id
        );
        if (deleteResponse != null) {
          return this.res.send({
            status: 1,
            message: "app link deleted successfully!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else {
        let updateData = {
          app_name: bodyData.app_name,
          app_link: bodyData.app_link,
        };

        let updateResponse = await OriginalAppLinks.findByIdAndUpdate(
          bodyData.app_id,
          updateData
        );
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "app link updated successfully!!",
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

module.exports = AppLinksController;
