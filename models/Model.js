class Model {
  constructor(collection) {
    this.collection = collection;
  }

  store(data) {
    return new Promise((resolve, reject) => {
      let collectionObject = new this.collection(data);

      collectionObject.save((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

module.exports = Model;
