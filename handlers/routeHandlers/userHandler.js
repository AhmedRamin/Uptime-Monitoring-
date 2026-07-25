// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helper/utilily");
const { parseJSON } = require("../../helper/utilily");

//
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//scaffolding
handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const toAggeement =
    typeof requestProperties.body.toAgreement === "boolean"
      ? requestProperties.body.toAgreement
      : false;

  if (firstName && lastName && phone && password && toAggeement) {
    //make sure that the user doesn't already exists
    data.read("user", phone, (err1, user) => {
      if (err1) {
        let userobject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          toAggeement,
        };
        // store the user to db
        data.create("user", phone, userobject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "user was created successfully",
            });
          } else {
            callback(500, {
              message: "could not create user!",
            });
          }
        });
      } else {
        callback(500, {
          error: "there was a problemm in server side",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have a problem in your request",
    });
  }
};

handler._users.get = (requestProperties, callback) => {
  //check the  phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  //
  if (phone) {
    //tookup the user
    data.read("user", phone, (err, u) => {
      const user = parseJSON(u);
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "requested user was not found ..",
        });
      }
    });
  } else {
    callback(404, {
      error: "requested user was not found ..",
    });
  }
};

handler._users.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  if (phone) {
    if (firstName || lastName || password) {
      //look up the user
      data.read("user", phone, (err, udata) => {
        const userdata = parseJSON(udata);
        if (!err && userdata) {
          if (firstName) {
            userdata.firstName = firstName;
          }
          if (lastName) {
            userdata.lastName = lastName;
          }
          if (password) {
            userdata.password = hash(password);
          }

          // update db
          data.update("user", phone, userdata, (err) => {
            if (!err) {
              callback(200, {
                message: "user was updated successfully",
              });
            } else {
              callback(500, {
                error: "there was a problem in the server side",
              });
            }
          });
        } else {
          callback(400, {
            error: "invalid phone number please try again",
          });
        }
      });
    }
  } else {
    callback(400, {
      error: "invalid phone number please try again",
    });
  }
};

handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  if (phone) {
    // Lookup the user
    data.read("user", phone, (err1, userdata) => {
      if (!err1 && userdata) {
        data.delete("user", phone, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User deleted successfully",
            });
          } else {
            callback(500, {
              error: "Could not delete the user",
            });
          }
        });
      } else {
        callback(404, {
          error: "User not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid phone number",
    });
  }
};

//export handler
module.exports = handler;
