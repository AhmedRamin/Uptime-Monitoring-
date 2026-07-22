const handler = {};

handler.notfoundhandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(404, {
    message: "invalid url",
  });
};

module.exports = handler;
