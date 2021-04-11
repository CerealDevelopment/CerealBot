import sum from "../lib/commands/sum";

test("adds 1 + 2 to equal 3", async () => {
  const result = await sum.sum([1, 2]);
  expect(result).toBe(3);
});
