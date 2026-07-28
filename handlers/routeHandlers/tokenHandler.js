// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helper/utilily");
const { parseJSON } = require("../../helper/utilily");
const { randomString } = require("../../helper/utilily");
//
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//scaffolding
handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 7
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("user", phone, (err, userData) => {
      if (!err && userData) {
        userData = parseJSON(userData);

        let hashedPassword = hash(password);

        if (hashedPassword === userData.password) {
          let tokenId = randomString(20);
          let expires = Date.now() + 60 * 60 * 1000;

          let tokenObject = {
            phone,
            tokenId,
            expires,
          };
          //store data
          data.create("token", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: "There was a problem on the server",
              });
            }
          });
        } else {
          callback(400, {
            error: "Phone and password do not match",
          });
        }
      } else {
        callback(404, {
          error: "User not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request .",
    });
  }
};

handler._token.get = (requestProperties, callback) => {
  const tokenid =
    typeof requestProperties.queryStringObject.tokenid === "string" &&
    requestProperties.queryStringObject.tokenid.trim().length === 20
      ? requestProperties.queryStringObject.tokenid
      : false;

  if (tokenid) {
    data.read("token", tokenid, (err, tdata) => {
      if (!err && tdata) {
        const tokenData = parseJSON(tdata);
        callback(200, tokenData);
      } else {
        callback(404, {
          error: "Requested token was not found.",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid token ID.",
    });
  }
};

handler._token.put = (requestProperties, callback) => {
  // Check token id
  const tokenid =
    typeof requestProperties.queryStringObject.tokenid === "string" &&
    requestProperties.queryStringObject.tokenid.trim().length === 20
      ? requestProperties.queryStringObject.tokenid.trim()
      : false;

  // Check extend property
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true;

  // Validate request
  if (tokenid && extend) {
    // Read token data
    data.read("token", tokenid, (err, tokenData) => {
      if (!err && tokenData) {
        // Parse JSON
        let tokenObject = parseJSON(tokenData);

        // Check expiration
        if (tokenObject.expires > Date.now()) {
          // Extend token for 1 hour
          tokenObject.expires = Date.now() + 60 * 60 * 1000;

          // Save updated token
          data.update("token", tokenid, tokenObject, (err2) => {
            if (!err2) {
              callback(200, {
                message: "Token updated successfully.",
                token: tokenObject,
              });
            } else {
              callback(500, {
                error:
                  "There was a server-side error while updating the token.",
              });
            }
          });
        } else {
          callback(400, {
            error: "Token has already expired.",
          });
        }
      } else {
        callback(404, {
          error: "Token not found.",
        });
      }
    });
  } else {
    callback(400, {
      error: "Missing or invalid token id or extend property.",
    });
  }
};

handler._token.delete = (requestProperties, callback) => {
  console.log("Query object:", requestProperties.queryStringObject);

  const tokenid =
    typeof requestProperties.queryStringObject.tokenid === "string" &&
    requestProperties.queryStringObject.tokenid.trim().length === 20
      ? requestProperties.queryStringObject.tokenid.trim()
      : false;

  console.log("Received token ID:", tokenid);

  if (tokenid) {
    data.read("token", tokenid, (err1, tokendata) => {
      console.log("Read error:", err1);
      console.log("Token data:", tokendata);

      if (!err1 && tokendata) {
        data.delete("token", tokenid, (err2) => {
          console.log("Delete error:", err2);

          if (!err2) {
            callback(200, {
              message: "Token deleted successfully",
            });
          } else {
            callback(500, {
              error: "Could not delete the token",
            });
          }
        });
      } else {
        callback(404, {
          error: "Token not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid token ID",
    });
  }
};

//export handler
module.exports = handler;
