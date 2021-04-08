import fs from "fs";

module.exports = async () => {
  // Create config file for CI tests
  global.CONFIG_FILE = fs.copyFile(
    "config.template.json",
    "config.json",
    (err) => {
      if (err) {
        console.log("Config already exists");
      }
    }
  );
};
