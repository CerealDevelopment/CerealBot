import sum from "../lib/commands/sum";

test("adds 1 + 2 to equal 3", () => {
  expect(sum.testable_fun([1, 2])).toBe(3);
});
