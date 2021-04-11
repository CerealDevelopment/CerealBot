import fs from "fs";

const PATH_TO_CONFIG = "config.json";
const createConfigIfNotExist = async (pathToConfig) => {
  const configExists = fs.existsSync(PATH_TO_CONFIG);
  if (!configExists) {
    fs.copyFile("config.template.json", pathToConfig, (err) => {
      if (err) {
        console.log("Config already exists");
      }
    });
  }
};

module.exports = async () => {
  // Create config file for CI tests
  global.CONFIG_FILE = createConfigIfNotExist(PATH_TO_CONFIG);
};
