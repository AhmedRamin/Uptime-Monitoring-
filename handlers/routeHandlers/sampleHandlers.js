/*

title : uptime Monitoring Application
Description: A Restful api to monitor up or down time of user defined links
Author : Ramin Ahmed ()
Date :22-07-2026


*/

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: "This is sample url",
  });
};

module.exports = handler;
