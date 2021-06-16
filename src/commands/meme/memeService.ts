import fetch from "node-fetch";
import { IMGUR } from "../../../config.json";
import { MemeResource } from "../../types";
import {
  selectRandomDbEntry,
  addBatchEntriesToDatabase,
  removeAllEntries,
  countDatabaseEntries,
} from "../../commands/meme/memeRepository";
import _ from "lodash";

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
    .then((response) => response.json())
    .catch((error: Error) => console.error(error))
    .finally(() => console.log("Imgur results fetched"));
};

/**
 *
 * @param result
 */
const parseImgurResponseToArray = (result: JSON): Array<MemeResource> => {
  const imgurResults: Array<undefined | MemeResource> = _.flatMap(
    result["data"]["items"],
    (item: JSON) => {
      if (item["is_album"]) {
        return _.map(item["images"], createNewEntry);
      } else {
        return createNewEntry(item);
      }
    }
  );
  return _.compact(imgurResults);
};

/**
 *
 * @param json
 * @returns
 */
const createNewEntry = (json: JSON): MemeResource | undefined => {
  if (imageTypes.has(json["type"])) {
    return new MemeResource(json);
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
  await removeAllEntries().finally(() =>
    console.log("Removed all old entries from database.")
  );
};

/**
 *
 */
const addCollectionOfMemesToDatabase = async (memes: Array<MemeResource>) => {
  if (!_.isEmpty(memes)) {
    await addBatchEntriesToDatabase(memes).finally(() =>
      console.log("New meme resources saved to database")
    );
  }
};

/**
 *
 */
const isMemeDatabaseEmpty = async (): Promise<boolean> => {
  return await countDatabaseEntries().then((result: Record<string, number>) => {
    return result[0]["count(`id`)"] == 0;
  });
};

export {
  fetchImgurResult,
  selectRandomMeme,
  removeAllMemeFromDatabase,
  parseImgurResponseToArray,
  addCollectionOfMemesToDatabase,
  isMemeDatabaseEmpty,
};
