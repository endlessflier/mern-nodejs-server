const Controller = require("./Controller");
const StuffImages = require("../models/StuffImagesSchema").StuffImages;
const StuffVideos = require("../models/StuffVideosSchema").StuffVideos;
const Model = require("../models/Model");
const Form = require("../services/Form");
const fs = require("fs");

class StuffController extends Controller {
  constructor() {
    super();
  }

  async addStuffImage() {
    try {
      let form = new Form(this.req);
      let formData = await form.parse();
      let image = formData.files.img[0];
      let fileName = `stuff_${Date.now()}.${
        image.originalFilename.split(".")[1]
      }`;
      let file = fs.readFileSync(image.path);
      fs.writeFileSync(`${__dirname}/../public/img/${fileName}`, file);
      let stuffImage = await new Model(StuffImages).store({
        image_path: `img/${fileName}`,
      });
      if (stuffImage != null) {
        return this.res.send({
          status: 1,
          message: "stuff image added!!",
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

  async getStuffImages() {
    try {
      let stuffImages = await StuffImages.find({});
      if (stuffImages != null) {
        return this.res.send({
          status: 1,
          message: "stuff images returned!!",
          data: stuffImages,
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

  async updateStuffImage() {
    try {
      let bodyData = this.req.body;
      let deleteResponse = await StuffImages.findByIdAndRemove(bodyData.img_id);
      if (deleteResponse != null) {
        return this.res.send({
          status: 1,
          message: "image deleted successfully!!",
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

  async addStuffVideo() {
    try {
      let bodyData = this.req.body;
      console.log(bodyData);
      let video = await new Model(StuffVideos).store(bodyData);
      if (video != null) {
        return this.res.send({
          status: 1,
          message: "stuff video added successfully!!",
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

  async getStuffVideos() {
    try {
      let id = this.req.params.id;
      if (id == "all") {
        let stuffVideos = await StuffVideos.find({});
        if (stuffVideos != null) {
          return this.res.send({
            status: 1,
            message: "stuff videos returned!!",
            data: stuffVideos,
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else {
        let video = await StuffVideos.findById(id);
        if (video != null) {
          return this.res.send({
            status: 1,
            message: "single video returned!!",
            data: video,
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

  async updateStuffVideos() {
    try {
      let bodyData = this.req.body;
      if (bodyData.is_delete) {
        let deleteResponse = await StuffVideos.findByIdAndRemove(
          bodyData.video_id
        );
        if (deleteResponse != null) {
          return this.res.send({
            status: 1,
            message: "video deleted successfully!!",
          });
        } else {
          return this.res.send({
            status: 0,
            message: "some error occoured!! please try again later!!",
          });
        }
      } else {
        let updateVideo = await StuffVideos.findByIdAndUpdate(
          bodyData.video_id,
          bodyData
        );
        if (updateVideo != null) {
          return this.res.send({
            status: 1,
            message: "video updated successfully!!",
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

module.exports = StuffController;
