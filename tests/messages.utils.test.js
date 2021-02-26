import { Message } from "./mock.discord";
import utils from "../src/messages/utils";

test('adds 1 + 2 to equal 3', () => {
  expect(utils.sum(1, 2, new Message())).toBe(3);
});
