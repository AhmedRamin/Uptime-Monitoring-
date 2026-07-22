const handler = {};

handler.aboutHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: "this is a about url",
  });
};

module.exports = handler;
