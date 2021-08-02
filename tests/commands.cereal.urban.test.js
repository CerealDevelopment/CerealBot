import * as fc from "fast-check";
import { getCerealColor } from "../lib/utils";
import { MessageEmbed } from "discord.js";
import { checkResponse, getFirstAnswer, buildEmbed } from "../lib/commands/cereal/urban";

it("should be true", async () => {
  const result = await checkResponse([1]);
  expect(result).toBeTruthy();
});

it("should be one element", async () => {
  await fc.assert(
    fc.asyncProperty(fc.array(fc.anything()), async data => {
      for (const item of data) {
        const answer = await getFirstAnswer([item]);
        if (answer == false) return;
        expect(item).toEqual(answer);
      }
    })
  );
});

it("should fail to build embed with empty input", async () => {
  const answer = {};
  const result = await buildEmbed(answer).catch(e => {
    expect(e).toBeInstanceOf(Error);
  });
  expect(result).toBeUndefined();
});

it("should build valid embed", async () => {
  const answer = {
    word: "Title",
    permalink: "URL",
    definition: "field1",
    example: "field2",
    thumps_up: "thumps_up",
    thumps_down: "thumps_down",
  };

  const result = await buildEmbed(answer);

  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(MessageEmbed);

  expect(result.hexColor).toBe(getCerealColor());
  expect(result.title).toBe(answer.word);
  expect(result.url).toBe(answer.permalink);
  expect(result.fields[0].value).toBe(answer.definition);
  expect(result.fields[1].value).toBe(answer.example);
});

it("should build valid embed with missing fields", async () => {
  const answer = {
    word: "Title",
    permalink: "URL",
    definition: "field1",
    example: "field2",
  };

  const result = await buildEmbed(answer);

  expect(result).toBeTruthy();
  expect(result).toBeInstanceOf(MessageEmbed);

  expect(result.hexColor).toBe(getCerealColor());
  expect(result.title).toBe(answer.word);
  expect(result.url).toBe(answer.permalink);
  expect(result.fields[0].value).toBe(answer.definition);
  expect(result.fields[1].value).toBe(answer.example);
});

const notEmptyStrings = { minLength: 1 };
it("should build a lot of valid embeds", async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.string(),
      fc.string(),
      fc.webUrl(),
      fc.string(notEmptyStrings),
      fc.integer(),
      fc.integer(),
      async (word, url, definition, example, thumbs_up, thumbs_down) => {
        const answer = {
          word: word,
          permalink: url,
          definition: definition,
          example: example,
          thumps_up: thumbs_up,
          thumps_down: thumbs_down,
        };
        const result = await buildEmbed(answer);

        expect(result).toBeTruthy();
        expect(result).toBeInstanceOf(MessageEmbed);

        expect(result.hexColor).toBe(getCerealColor());
        expect(result.title).toBe(answer.word);
        expect(result.url).toBe(answer.permalink);
        expect(result.fields[0].value).toBe(answer.definition);
        expect(result.fields[1].value).toBe(answer.example);
      }
    )
  );
});
