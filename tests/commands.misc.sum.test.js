import { sum } from "../lib/commands/misc/sum";

test("adds 1 + 2 to equal 3", async () => {
  const result = await sum([1, 2]);
  expect(result).toBe(3);
});
