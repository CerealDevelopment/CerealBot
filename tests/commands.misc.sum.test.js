import * as fc from "fast-check";
import { sum } from "../lib/commands/misc/sum";

it("adds 1 + 2 to equal 3", async () => {
  const result = await sum([1, 2]);
  expect(result).toBe(3);
});

it("should be bigger", async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }), { minLength: 2, maxLength: 1000 }),
      async data => {
        const summed = await sum(data);
        expect(summed).toEqual(expect.any(Number));

        for (const item of data) {
          expect(summed).toBeGreaterThanOrEqual(item);
        }
      }
    )
  );
});

it("should be smaller", async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.integer({ min: Number.MIN_SAFE_INTEGER, max: 0 }), { minLength: 2, maxLength: 1000 }),
      async data => {
        const summed = await sum(data);
        expect(summed).toEqual(expect.any(Number));

        for (const item of data) {
          expect(item).toBeGreaterThanOrEqual(summed);
        }
      }
    )
  );
});
