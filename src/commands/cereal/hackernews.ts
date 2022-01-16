import { Message, MessageEmbed } from "discord.js";
import _ from "lodash";
import fetch from "node-fetch";
import { HACKERNEWS as H, DISCORD } from "../../../config.json";
import logger from "../../logging";
import { HackerNews } from "../../models/hackerNews";
import { getCerealColor, trim } from "../../utils";

const fetchHackerNews = async (url: string): Promise<Object> => {
  return await fetch(url, {}).then(response => response.json());
};

const checkValidResponseOfTopHackerNews = (res: Object): number[] => {
  if (_.isArrayLike(res)) {
    if (_.isInteger(res[0])) {
      return res as number[];
    }
  }
  throw new Error(`HackerNews response is not parsable:\n${res}`);
};

const takeTopPosts = (res: number[], numberOfPosts: number): number[] => {
  return res.slice(0, numberOfPosts);
};

/**
 * Get news stories based on a list of story ids
 * @param stories Array of ids of stories
 * @returns Array of HackerNews
 */
const getNewsStories = async (stories: number[]): Promise<HackerNews[]> => {
  const baseURL = H.BASE_URL;
  let listOfNews = [];
  for (const i of stories) {
    const s = await fetchHackerNews(baseURL + H.STORY + i + H.URL_SUFFIX);
    const newsStory = new HackerNews(
      s["by"],
      s["descendants"],
      s["id"],
      s["kids"],
      s["score"],
      s["time"],
      s["title"],
      s["type"],
      s["url"]
    );
    listOfNews.push(newsStory);
  }
  return listOfNews;
};

/**
 * Parse args. The args can only be integers
 * @param args arguments of the command
 * @returns Parsed args to get the number of posts to create
 */
const parseArgs = (args: string[], min: number = 1, max: number = 10): number => {
  let numberOfPosts = 5;

  if (args) {
    if (args.length !== 0) {
      if (args.length === 1) {
        const parsedArg = parseInt(args[0]);
        if (_.isInteger(parsedArg)) {
          numberOfPosts = Math.abs(parsedArg);
          numberOfPosts = Math.max(parsedArg, min);
          numberOfPosts = Math.min(parsedArg, max);
        } else {
          throw new Error("Argument not parsable");
        }
      } else {
        throw new Error("Too many arguments");
      }
    }
  }
  return numberOfPosts;
};

/**
 * Get the news from Hackernews and return a function to create a properly formatted output
 * @param url URL of Hackernews
 * @param args Arguments of the command
 * @param createPosts A function to create a post
 * @returns A function that creates a post
 */
const createNews = async (url: string, args: string[], createPosts: Function): Promise<{ embeds: MessageEmbed[] }> => {
  const response = await fetchHackerNews(url).then(checkValidResponseOfTopHackerNews);
  if (_.isError(response)) {
    return;
  }
  const numberOfPosts = parseArgs(args);
  const topPosts = takeTopPosts(response, numberOfPosts);
  const hackerNews = await getNewsStories(topPosts);

  return createPosts(hackerNews);
};

module.exports = {
  name: "hackernews",
  description: "Get the latest HackerNews",
  hasArgs: false,
  neededUserPermissions: [],
  usage: "<number_of_posts>",
  async execute(message: any, args: string[]) {
    const createHackerNews = _.partial(createNews, H.BASE_URL + H.BESTSTORIES + H.URL_SUFFIX, args);
    const discordPost = (news: HackerNews[]): { embeds: MessageEmbed[] } => {
      const embed = {
        embeds: _.map(news, n => {
          return new MessageEmbed()
            .setColor(getCerealColor())
            .setTitle(n.title)
            .setAuthor(n.by)
            .setURL(n.url)
            .setDescription(`Comments: ${H.COMMENT_URL}${n.id}`)
            .addFields({
              name: "Score",
              value: trim(n.score.toString(), DISCORD.EMBED.FIELD_CHAR_LIMIT),
            });
        }),
      };
      return embed;
    };

    const consolePost = (news: HackerNews[]): string[] => {
      const out = _.map(news, n => {
        return `
          Title: ${n.title},
          Author: ${n.by},
          URL: ${n.url}
          `;
      });

      return out;
    };

    if (message instanceof Message) {
      const news = await createHackerNews(discordPost).catch(e => {
        logger.error(e);
        return {
          embeds: [new MessageEmbed().setTitle("No news were found.").setColor(getCerealColor())],
        };
      });
      message.channel.send(news);
    } else if (message instanceof String) {
      const news = await createHackerNews(consolePost).catch(e => {
        logger.error(e);
        return e;
      });
      return news;
    } else {
      logger.error(`Unknown message type: ${typeof message}`);
    }
  },
  getNewsStories,
};
