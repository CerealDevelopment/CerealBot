export class MemeResource {
  id: string;
  title: string;
  description: string;
  link: string;
  nsfw: boolean;
  type: string;

  constructor(imgurResult: JSON) {
    this.id = imgurResult["id"];
    this.title = imgurResult["title"];
    this.description = imgurResult["description"];
    this.link = imgurResult["link"];
    this.nsfw = imgurResult["nsfw"];
    this.type = imgurResult["type"];
  }
}
