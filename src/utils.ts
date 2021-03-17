import fs from "fs";

function findFilesWithEnding(
  directory: string,
  endsWith: string
): Array<string> {
  return fs.readdirSync(directory).filter((file) => file.endsWith(endsWith));
}

export default {
  findFilesWithEnding,
};
