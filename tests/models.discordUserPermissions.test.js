import { userPermissions } from "../lib/models/discordUserPermissions";

test("there should be 9 permissions", () => {
  expect(Object.keys(userPermissions).length).toEqual(9);
});
