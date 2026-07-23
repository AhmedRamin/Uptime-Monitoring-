/*

title : uptime Monitoring Application
Description: A Restful api to monitor up or down time of user defined links
Author : Ramin Ahmed ()
Date :22-07-2026


*/

// dependencies
const { StringDecoder } = require("string_decoder");
const url = require("url");
const routes = require("../routes");
const { notfoundhandler } = require("../handlers/notfoundHandler");
const { json } = require("stream/consumers");
//module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  //request handling
  // get the url and parse it
  const parseurl = url.parse(req.url, true);
  console.log(parseurl);
  const path = parseurl.pathname;
  const trimmedpath = path.replace(/^\/+|\/+$/g, "");
  console.log(trimmedpath);
  const method = req.method.toLowerCase();
  //console.log(method);
  const queryStringObject = parseurl.query;
  // console.log(queryStringObject);
  const headerobject = req.headers;
  // console.log(headerobject);
  const body = {};
  const requestProperties = {
    parseurl,
    path,
    trimmedpath,
    method,
    queryStringObject,
    headerobject,
    body,
  };
  //check which router path -it is a function
  const chosenHandler = routes[trimmedpath]
    ? routes[trimmedpath]
    : notfoundhandler;

  //decoding
  const decoder = new StringDecoder("utf-8");

  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    requestProperties.body = realData;
    console.log(requestProperties.body);
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 504;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);
      // return the final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
    // response handle
    //  res.end("Hello, Bangladesh");
  });
};
//module export
module.exports = handler;
