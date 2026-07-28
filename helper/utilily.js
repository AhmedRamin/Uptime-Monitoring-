//dependencies
const crypto = require("crypto");
const environment = require("./environment");
const { match } = require("assert");
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

// create random string
utility.randomString = (stringlength) => {
  let length = stringlength;
  length =
    typeof stringlength === "number" && stringlength > 0 ? stringlength : false;
  if (length) {
    let possiblecharecters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";

    for (let i = 1; i <= length; i++) {
      let randomCharacter = possiblecharecters.charAt(
        Math.floor(Math.random() * possiblecharecters.length),
      );
      output = output + randomCharacter;
    }
    return output;
  } else {
    return false;
  }
};

module.exports = utility;
