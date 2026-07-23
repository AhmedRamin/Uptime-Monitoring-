/*

title : uptime Monitoring Application
Description: A Restful api to monitor up or down time of user defined links
Author : Ramin Ahmed ()
Date :22-07-2026


*/

// dependencies
const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const { handleReqRes } = require("./helper/handleReqRes");
const environment = require("./helper/environment");
const data = require("./lib/data");
//app object - module scaffolding
const app = {};

//testing file system
//todo pore muche dibo
// data.create("test", "secondfile", { name: "Ramin", roll: 330 }, (err) => {
//   console.log("error was  ", err);
// });

//data read
// data.read("test", "secondfile", (err, data) => {
//   console.log(err, data);
// });

//update file system

// data.update("test", "secondfile", { name: "MIla", roll: 190 }, (err) => {
//   console.log("error was  ", err);
// });

//delete file system
data.delete("test", "secondfile", (err) => {
  console.log("error was  ", err);
});

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`environment variable is ${process.env.Node_Env}`);
    console.log(`listening to port ${environment.port}`);
  });
};

// handle request response
app.handleReqRes = handleReqRes;

//start the server
app.createServer();
