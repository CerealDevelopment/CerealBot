import { Knex } from "knex";
import path from "path";
import { DATABASE } from "../../config.json";

interface IKnexConfig {
  [key: string]: Knex.Config;
}

const knexConfig: IKnexConfig = {
  development: {
    client: DATABASE.CLIENT,
    connection: {
      filename: path.resolve(__dirname, "../../" + DATABASE.NAME),
    },
    debug: DATABASE.DEBUG,
    useNullAsDefault: DATABASE.USE_NULL_AS_DEFAULT,
  },
  // Additional stages can be added
};

export default knexConfig;
