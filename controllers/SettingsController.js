const Controller = require("./Controller");
const Model = require("../models/Model");
const Settings = require("../models/SettingsSchema").Settings;
const StockChanges = require("../models/StockChangeSchema").StockChanges;
const Form = require("../services/Form");
const fs = require("fs");

class SettingsController extends Controller {
  constructor() {
    super();
  }

  async Add() {
    try {
      let bodyData = this.req.bodyData;
      let addSettings = await new Model(Settings).store(bodyData);
      if (addSettings != null) {
        return this.res.send({
          status: 1,
          message: "settings added successfully!!",
        });
      } else {
        return this.res.send({
          status: 1,
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

  async Update() {
    try {
      let bodyData = this.req.body;
      let updateData = {};
      if (bodyData.hasOwnProperty("static_data")) {
        updateData = {
          popup_text: bodyData.popup_text,
          official_website_link: bodyData.official_website_link,
          company_name: bodyData.company_name,
          brand_name_1: bodyData.brand_name_1,
          buissness_model_1: bodyData.buissness_model_1,
          brand_name_2: bodyData.brand_name_2,
          buissness_model_2: bodyData.buissness_model_2,
          brand_name_3: bodyData.brand_name_3,
          buissness_model_3: bodyData.buissness_model_3,
          brand_name_4: bodyData.brand_name_4,
          buissness_model_4: bodyData.buissness_model_4,
          brand_name_5: bodyData.brand_name_5,
          buissness_model_5: bodyData.buissness_model_5,
          brand_name_6: bodyData.brand_name_6,
          buissness_model_6: bodyData.buissness_model_6,
          hint_text: bodyData.hint_text,
          contact_email: bodyData.contact_email,
          free_stocks_to_give: bodyData.free_stocks_to_give,
          referal_stocks: bodyData.referal_stocks,
        };
      } else if (bodyData.hasOwnProperty("stock_price")) {
        updateData = {
          current_stock_price: bodyData.current_stock_price,
        };

        let stockPriceChangeData = {
          previous_price: bodyData.previous_price,
          current_price: bodyData.current_stock_price,
        };

        let stockChanges = await new Model(StockChanges).store(
          stockPriceChangeData
        );
      } else if (bodyData.hasOwnProperty("page_status_change")) {
        updateData = {
          is_join_form_enabled: bodyData.is_join_form_enabled,
          transfers_enabled: bodyData.transfers_enabled,
          app_links_enabled: bodyData.app_links_enabled,
          join_form_close_duration: bodyData.join_form_close_duration,
        };
      } else {
        return this.res.send({
          status: 0,
          message: "send update type!!",
        });
      }
      let updateSettings = await Settings.updateOne({}, updateData);
      if (updateSettings != null) {
        return this.res.send({
          status: 1,
          message: "settings updated successfully!!",
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

  async Get() {
    try {
      let settings = await Settings.findOne({});
      if (settings != null) {
        return this.res.send({
          status: 1,
          message: "settings returned!!",
          data: settings,
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

  async updateHomeBannerImage() {
    try {
      let form = new Form(this.req);
      let formData = await form.parse();
      console.log(formData);
      let bannerImageFile = formData.files.banner_image[0];
      console.log(bannerImageFile);
      let fileName = `home_banner_${Date.now()}.${
        bannerImageFile.originalFilename.split(".")[1]
      }`;
      let file = fs.readFileSync(bannerImageFile.path);
      fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
      let updateData = {
        homepage_big_banner: `img/${fileName}`,
      };
      let updateSettings = await Settings.updateOne({}, updateData);
      if (updateSettings != null) {
        return this.res.send({
          status: 1,
          message: "home banner uploaded successfully!!",
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

  async updateHomeAdvertisementImages() {
    try {
      let form = new Form(this.req);
      let formData = await form.parse();
      let imgFile = formData.files.img[0];
      if (formData.fields.hasOwnProperty("img_1")) {
        let fileName = `home_img_${Date.now()}.${
          imgFile.originalFilename.split(".")[1]
        }`;
        let file = fs.readFileSync(imgFile.path);
        fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
        let updateData = {
          advertisement_image_1: `img/${fileName}`,
        };
        let updateResponse = await Settings.updateOne({}, updateData);
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "home advertisement image 1 updated!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else if (formData.fields.hasOwnProperty("img_1_actual")) {
        let fileName = `home_img_${Date.now()}.${
          imgFile.originalFilename.split(".")[1]
        }`;
        let file = fs.readFileSync(imgFile.path);
        fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
        let updateData = {
          advertisement_image_1_actual: `img/${fileName}`,
        };
        let updateResponse = await Settings.updateOne({}, updateData);
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "home advertisement image 1 actual updated!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else if (formData.fields.hasOwnProperty("img_2")) {
        let fileName = `home_img_${Date.now()}.${
          imgFile.originalFilename.split(".")[1]
        }`;
        let file = fs.readFileSync(imgFile.path);
        fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
        let updateData = {
          advertisement_image_2: `img/${fileName}`,
        };
        let updateResponse = await Settings.updateOne({}, updateData);
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "home advertisement image 2 updated!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else if (formData.fields.hasOwnProperty("img_3")) {
        let fileName = `home_img_${Date.now()}.${
          imgFile.originalFilename.split(".")[1]
        }`;
        let file = fs.readFileSync(imgFile.path);
        fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
        let updateData = {
          advertisement_image_3: `img/${fileName}`,
        };
        let updateResponse = await Settings.updateOne({}, updateData);
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "home advertisement image 3 updated!!",
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

  async updatePageBanners() {
    try {
      let form = new Form(this.req);
      let formData = await form.parse();
      let imgFile = formData.files.img;
      if (formData.fields.hasOwnProperty("home_2")) {
        let fileName = "";
        if (imgFile) {
          fileName = `banner_${Date.now()}.${
            imgFile[0].originalFilename.split(".")[1]
          }`;
          let file = fs.readFileSync(imgFile[0].path);
          fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
        }
        let updateData = {};
        if (imgFile) {
          updateData = {
            home_banner_2: `img/${fileName}`,
            home_banner_2_link: formData.fields.home_2[0],
          };
        } else {
          updateData = {
            home_banner_2_link: formData.fields.home_2[0],
          };
        }
        let updateResponse = await Settings.updateOne({}, updateData);
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "home banner updated!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else if (formData.fields.hasOwnProperty("home_3")) {
        let fileName = "";
        if (imgFile) {
          fileName = `banner_${Date.now()}.${
            imgFile[0].originalFilename.split(".")[1]
          }`;
          let file = fs.readFileSync(imgFile[0].path);
          fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
        }
        let updateData = {};
        if (imgFile) {
          updateData = {
            home_banner_3: `img/${fileName}`,
            home_banner_3_link: formData.fields.home_3[0],
          };
        } else {
          updateData = {
            home_banner_3_link: formData.fields.home_3[0],
          };
        }
        let updateResponse = await Settings.updateOne({}, updateData);
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "home banner updated!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else if (formData.fields.hasOwnProperty("stuff")) {
        let fileName = "";
        if (imgFile) {
          fileName = `banner_${Date.now()}.${
            imgFile[0].originalFilename.split(".")[1]
          }`;
          let file = fs.readFileSync(imgFile[0].path);
          fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
        }
        let updateData = {};
        if (imgFile) {
          updateData = {
            stuff_page_banner: `img/${fileName}`,
            stuff_page_banner_link: formData.fields.stuff[0],
          };
        } else {
          updateData = {
            stuff_page_banner_link: formData.fields.stuff[0],
          };
        }
        let updateResponse = await Settings.updateOne({}, updateData);
        if (updateResponse != null) {
          return this.res.send({
            status: 1,
            message: "stuff page banner updated!!",
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

module.exports = SettingsController;
