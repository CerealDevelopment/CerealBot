import utils from "../lib/messages/utils";

test("adds 1 + 2 to equal 3", () => {
  expect(utils.sum([1, 2])).toBe(3);
});
