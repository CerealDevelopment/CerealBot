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

const checkValidResponse = (res: Object): number[] => {
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

const createNews = async (url: string, createPosts: Function): Promise<{ embeds: MessageEmbed[] }> => {
  const response = await fetchHackerNews(url).then(checkValidResponse);
  if (_.isError(response)) {
    return;
  }
  const topPosts = takeTopPosts(response, 5);
  const hackerNews = await getNewsStories(topPosts);

  return createPosts(hackerNews);
};

module.exports = {
  name: "hackernews",
  description: "Get the latest HackerNews",
  hasArgs: false,
  neededUserPermissions: [],
  usage: "",
  async execute(message: Message, args: string[]) {
    const createHackerNews = _.partial(createNews, H.BASE_URL + H.BESTSTORIES + H.URL_SUFFIX);
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

    if (message instanceof Message) {
      const news = await createHackerNews(discordPost).catch(e => {
        logger.error(e);
        return {
          embeds: [new MessageEmbed().setTitle("No news were found.").setColor(getCerealColor())],
        };
      });
      message.channel.send(news);
    } else {
      logger.error(`Unknown message type: ${typeof message}`);
    }
  },
};
