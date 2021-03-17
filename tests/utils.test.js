import utils from "../lib/utils";

test("find files ending .md", () => {
  expect(utils.findFilesWithEnding(".", ".md")).toEqual(["README.md"]);
});

test("find files ending .exe", () => {
    expect(utils.findFilesWithEnding(".", ".exe")).toEqual([]);
  });