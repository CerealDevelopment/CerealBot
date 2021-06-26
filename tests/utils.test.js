import fs from "fs";
import { findFilesWithEnding, getRandomNumber, getCommandMap } from "../lib/utils";

it("find files ending .md", () => {
  expect(findFilesWithEnding(".", ".md")).toEqual(["README.md"]);
});

it("find files ending .exe", () => {
  expect(findFilesWithEnding(".", ".exe")).toEqual([]);
});

it("size of command map", () => {
  const commandFolders = fs.readdirSync("lib/commands");
  let files = [];
  for (const folder of commandFolders) {
    files = files.concat(findFilesWithEnding(`lib/commands/${folder}/`, ".js"));
  }
  const expectedSize = Object.keys(files).length;
  expect(getCommandMap().size).toBe(expectedSize);
});

function numberGenerator(maxValue = 100) {
  let output = [];
  for (let i = 0; i < 500; i++) {
    output.push(Math.floor(Math.random() * maxValue));
  }
  return output;
}

const maxValue = 100;
it.each(numberGenerator(maxValue))("%i should not be equal the last number", n => {
  const result = getRandomNumber(maxValue, n);
  expect(result).toBeDefined();
  expect(result).toBeLessThanOrEqual(maxValue);
  expect(result).toBeGreaterThanOrEqual(0);
  expect(result).not.toBe(n);
});
