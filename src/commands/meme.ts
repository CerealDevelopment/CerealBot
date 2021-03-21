import { AxiosRequestConfig } from 'axios'
import { getResource } from '../api/http'
import { DANBOORU_RANDOM_URL } from '../../config.json'

const config: AxiosRequestConfig = {
  headers: {
      Accept: "application/json"
  }
}

module.exports = {
  name: "meme",
  args: false,
  usage: "<9gag>|<anime>|<joke>",
  description: "",
  execute(message) {
    getResource(DANBOORU_RANDOM_URL, config).then(result => {
      message.channel.send(result.data["file_url"]);
    })
  },
};
