//dependencies
const { error } = require("console");
const fs = require("fs");
const path = require("path");

//module scaffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, "../.Data/");

// write data to file
lib.create = function (dir, file, data, callback) {
  //open file for writing
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        //convert data to string
        const stringData = JSON.stringify(data);
        //write data to file and then close it

        fs.writeFile(fileDescriptor, stringData, (err2) => {
          if (!err2) {
            fs.close(fileDescriptor, (err3) => {
              if (!err3) {
                callback(false);
              } else {
                callback("Error closing the new file");
              }
            });
          } else {
            callback("Error writing to new file ");
          }
        });
      } else {
        callback("threre was error file may exit");
      }
    },
  );
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

//update
lib.update = (dir, file, data, callback) => {
  //file open for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert the data to string
      const stringData = JSON.stringify(data);

      //truncate the file
      fs.ftruncate(fileDescriptor, (err1) => {
        if (!err1) {
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err2) => {
            if (!err2) {
              fs.close(fileDescriptor, (err3) => {
                if (!err3) {
                  callback(false);
                } else {
                  callback("error closing file ...");
                }
              });
            } else {
              callback("Error writing to file");
            }
          });
        } else {
          console.log("Error Truncating File!");
        }
      });
    } else {
      console.log("Error updating .file may not exist");
    }
  });
};

//delete exiting file
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleteing file ...");
    }
  });
};
module.exports = lib;
