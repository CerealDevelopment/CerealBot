import fetch from "node-fetch";
import { IMGUR } from "../../../config.json";
import { MemeResource } from "../../models/meme";
import {
  selectRandomDbEntry,
  addBatchEntriesToDatabase,
  removeAllEntries,
  countDatabaseEntries,
} from "../../commands/meme/memeRepository";
import _ from "lodash";
import logger from "../../logging";

const headers = {
  Accept: "application/json",
  Authorization: IMGUR.AUTHORIZATION,
};
const imageTypes: Set<string> = new Set(["image/jpeg", "image/png"]);

/**
 *
 */
const fetchImgurResult = async (): Promise<JSON> => {
  return await fetch(IMGUR.URL, { headers: headers })
    .then(response => response.json())
    .catch(error => logger.error(error))
    .finally(() => logger.debug("Imgur results fetched"));
};

/**
 *
 * @param result
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
 *
 * @param json
 * @returns
 */
const createNewEntry = (memeResource: JSON): MemeResource | undefined => {
  if (imageTypes.has(memeResource["type"])) {
    return new MemeResource(memeResource);
  }
};

/**
 *
 * @returns
 */
const selectRandomMeme = async (): Promise<MemeResource> => {
  return await selectRandomDbEntry();
};

/**
 *
 */
const removeAllMemeFromDatabase = async () => {
  await removeAllEntries().finally(() => logger.info("Removed all old entries from database."));
};

/**
 *
 */
const addCollectionOfMemesToDatabase = async (memes: Array<MemeResource>) => {
  if (!_.isEmpty(memes)) {
    await addBatchEntriesToDatabase(memes).finally(() => logger.debug("New meme resources saved to database"));
  }
};

/**
 *
 */
const isMemeDatabaseEmpty = async (): Promise<boolean> => {
  return await countDatabaseEntries().then(result => {
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
