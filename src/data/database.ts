import { knex as _knex } from "knex";
import logger from "../logging";

const knex = _knex({
  client: "sqlite3",
  connection: {
    filename: process.env.SQLITE_FILENAME ?? "data/database.sqlite",
  },
  useNullAsDefault: true,
  log: {
    warn(message) {
      logger.warn(message);
    },
    error(message) {
      logger.error(message);
    },
    deprecate(message) {
      logger.warn(message);
    },
    debug(message) {
      logger.debug(message);
    },
  },
});

export default knex;
