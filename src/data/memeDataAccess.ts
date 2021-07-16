import fetch from "node-fetch";
import { knex, Knex } from "knex";
import { IMGUR, MEME, DATABASE } from "../../config.json";
import { MemeResource } from "../models/meme";
import _ from "lodash";

const db = knex(DATABASE.KNEX_CONFIG as Knex.Config);

const headers = {
  Accept: "application/json",
  Authorization: IMGUR.AUTHORIZATION,
};
const imageTypes: Set<string> = new Set(["image/jpeg", "image/png"]);

/**
 * Call Imgur api and fetch result
 * @returns JSON response from Imgur
 */
const fetchImgurResult = async (): Promise<JSON> => {
  return await fetch(IMGUR.URL, { headers: headers }).then(response => response.json());
};

/**
 * JSON response with memes is parsed and converted to an Array if MemeResource objects
 * @param result JSON response
 * @Return Array of MemeResources
 */
const parseMemeResponseToArray = (result: JSON): Array<MemeResource> => {
  if (!result) {
    throw new Error("result must not be null.");
  }
  const imgurResults: Array<undefined | MemeResource> = _.flatMap(result["data"]["items"], (item: JSON) => {
    if (item["is_album"]) {
      return _.map(item["images"], createNewEntry);
    } else {
      return createNewEntry(item);
    }
  });
  return _.compact(imgurResults);
};

/**
 * A single meme response is parsed to a MemeResource object
 * @param memeResource Single meme resource as JSON
 * @returns Single MemeResource or undefined
 */
const createNewEntry = (memeResource: JSON): MemeResource | undefined => {
  if (imageTypes.has(memeResource["type"])) {
    return new MemeResource(memeResource);
  }
};

/**
 * Select a random meme entry from database
 * @returns Random meme
 */
const selectRandomMeme = async (): Promise<MemeResource> => {
  const [result] = await db
    .select("*")
    .whereNull("nsfw")
    .from<MemeResource>(MEME.TABLE_NAME)
    .orderByRaw("RANDOM()")
    .limit(1);
  if (_.isEmpty(result)) {
    throw new Error("No entries in database present.");
  }
  return result;
};

/**
 * Call to remove all memes from the meme table
 */
const removeAllMemeFromDatabase = async () => {
  await db(MEME.TABLE_NAME).whereNotNull("id").del();
};

/**
 * Call to add a batch of memes to the database
 * @param memes An array of MemeResources
 */
const addCollectionOfMemesToDatabase = async (memes: Array<MemeResource>) => {
  if (!_.isEmpty(memes)) {
    await db(MEME.TABLE_NAME).insert(memes);
  }
};

/**
 * Determine if the meme table is empty
 * @returns A status if database is empty or not
 */
const isMemeDatabaseEmpty = async (): Promise<boolean | void> => {
  return await db(MEME.TABLE_NAME)
    .count<Record<string, number>>("id")
    .then(result => {
      return result[0]["count(`id`)"] == 0;
    });
};

export {
  fetchImgurResult,
  selectRandomMeme,
  removeAllMemeFromDatabase,
  parseMemeResponseToArray,
  addCollectionOfMemesToDatabase,
  isMemeDatabaseEmpty,
};