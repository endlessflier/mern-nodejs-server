const multiparty = require("multiparty");

class Form {
  constructor(req) {
    this.req = req;
  }

  parse() {
    return new Promise((resolve, reject) => {
      let form = new multiparty.Form();

      form.parse(this.req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          let data = {
            fields: fields,
            files: files,
          };

          resolve(data);
        }
      });
    });
  }
}

module.exports = Form;
