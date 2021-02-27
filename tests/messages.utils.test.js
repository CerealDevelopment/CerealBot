import MockDiscord from "./mock.discord";
import utils from "../lib/messages/utils";

const discord = new MockDiscord()

test("adds 1 + 2 to equal 3", () => {
  expect(utils.sum([1, 2])).toBe(3);
});
