import { dispatchPrefixFun } from "../lib/commands/guild/prefix";

it("should throw an error, because of too long prefix", async () => {
  const result = await dispatchPrefixFun("1", ["1234"]).catch(e => {
    expect(e).toBeInstanceOf(Error);
  });
  expect(result).toBeUndefined();
});

it("should throw an error, because of too long array", async () => {
  const result = await dispatchPrefixFun("1", ["!", "%"]).catch(e => {
    expect(e).toBeInstanceOf(Error);
  });
  expect(result).toBeUndefined();
});
