import {
  findFilesWithEnding,
  getRandomNumber,
  getCommandMap,
} from "../lib/utils";

test("find files ending .md", () => {
  expect(findFilesWithEnding(".", ".md")).toEqual(["README.md"]);
});

test("find files ending .exe", () => {
  expect(findFilesWithEnding(".", ".exe")).toEqual([]);
});

const maxValue = 100;
function numberGenerator() {
  let output = [];
  for (let i = 0; i < 500; i++) {
    output.push(Math.floor(Math.random() * maxValue));
  }
  return output;
}

test.each(numberGenerator())("%i should not be equal the last number", (n) => {
  expect(getRandomNumber(maxValue, n)).not.toBe(n);
});

test("size of command map", () => {
  const files = findFilesWithEnding("lib/commands", ".js");
  const expectedSize = Object.keys(files).length;
  expect(getCommandMap().size).toBe(expectedSize);
});
