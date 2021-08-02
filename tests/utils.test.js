import fs from "fs";
import * as fc from "fast-check";
import { findFilesWithEnding, getRandomNumber, getCommandMap } from "../lib/utils";

it("find files ending .md", () => {
  expect(findFilesWithEnding(".", ".md")).toEqual(["README.md"]);
});

it("find files ending .exe", () => {
  expect(findFilesWithEnding(".", ".exe")).toEqual([]);
});

it("each command should implement the CommandInterface", () => {
  const commandFolders = fs.readdirSync("lib/commands");
  let files = [];
  for (const folder of commandFolders) {
    files = files.concat(findFilesWithEnding(`lib/commands/${folder}/`, ".js"));
  }

  const expectedSize = Object.keys(files).length;
  const commandMap = getCommandMap();
  expect(commandMap.size).toBe(expectedSize);

  for (const [key, value] of commandMap.entries()) {
    expect(key.length).toBeGreaterThan(2);
    expect(value.name).toBeDefined();
    expect(value.description).toBeDefined();
    expect(value.hasArgs).toBeDefined();
    expect(value.neededUserPermissions).toBeDefined();
    expect(value.usage).toBeDefined();
    expect(value.execute).toBeDefined();
  }
});

const maxValue = Number.MAX_SAFE_INTEGER;
it("should not be equal the last number", () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: maxValue }), number => {
      const result = getRandomNumber(maxValue, number);
      expect(result).toBeDefined();
      expect(result).toBeLessThanOrEqual(maxValue);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).not.toBe(number);
    })
  );
});
