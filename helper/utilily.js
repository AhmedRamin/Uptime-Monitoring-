//dependencies
const crypto = require("crypto");
const environment = require("./environment");
//module scaffolding

const utility = {};

utility.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};
//hash string
utility.hash = (string) => {
  if (typeof string === "string" && string.length > 0) {
    const hash = crypto
      .createHmac("sha256", environment.secretkey)
      .update(string)
      .digest("hex");
    return hash;
  } else {
    false;
  }
};

module.exports = utility;
