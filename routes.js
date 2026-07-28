/*

title : uptime Monitoring Application
Description: A Restful api to monitor up or down time of user defined links
Author : Ramin Ahmed ()
Date :22-07-2026


*/

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandlers");
const { aboutHandler } = require("./handlers/routeHandlers/abouthandelers");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
//routing

const routes = {
  sample: sampleHandler,
  about: aboutHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
