import { createNewMemeResource, parseMemeResponseToArray, isImgurJsonUsable } from "../src/data/memeDataAccess";
import { MemeResource } from "../src/models/meme";

const memeResponseWithImage = {
  id: "123456",
  title: "Cool title",
  description: "Cool description",
  link: "https://example.com",
  nsfw: null,
  type: "image/jpeg",
  created_at: new Date(),
};

const nsfwMemeResponseWithImage = {
  id: "123456",
  title: "Steamy image",
  description: "Steamy description",
  link: "https://example.com",
  nsfw: true,
  type: "image/jpeg",
  created_at: new Date(),
};

const memeResponseWithVideo = {
  id: "123456",
  title: "Cool title",
  description: "Cool description",
  link: "https://example.com",
  nsfw: null,
  type: "video/mp4",
  created_at: new Date(),
};

const memeResponseMalformed = {
  id: "",
  link: null,
  nsfw: null,
  unwantedAttribute: "hihihi",
  type: {
    mime: "image/jpeg",
  },
  created_at: new Date(),
};

const imgurNonAlbumMemeResponse = {
  data: {
    items: [
      {
        is_album: false,
        id: "123456",
        title: "Non album meme",
        description: "Non album meme description",
        link: "https://example.com",
        nsfw: null,
        type: "image/jpeg",
        created_at: new Date(),
      },
    ],
  },
};

const imgurAlbumMemeResponse = {
  data: {
    items: [
      {
        is_album: true,
        images: [
          memeResponseWithImage,
          memeResponseWithImage,
          nsfwMemeResponseWithImage,
          memeResponseWithVideo,
          memeResponseMalformed,
        ],
      },
    ],
  },
};

describe("Test parsing of multiple memes", () => {
  it("should return two entries in album object", () => {
    let actualMemes = parseMemeResponseToArray(imgurAlbumMemeResponse);
    expect(actualMemes).not.toBeNull();
    expect(actualMemes).toHaveLength(2);
  });

  it("should return one entry in non album object", () => {
    let actualMemes = parseMemeResponseToArray(imgurNonAlbumMemeResponse);
    expect(actualMemes).not.toBeNull();
    expect(actualMemes).toHaveLength(1);
  });
});

describe("Test if createNewMemeResource() returns MemeResource", () => {
  it("should return a MemeResource instance", () => {
    let actualMeme = createNewMemeResource(memeResponseWithImage);
    expect(actualMeme).toBeDefined();
    expect(actualMeme).toBeInstanceOf(MemeResource);
  });
});

describe("Tests if isImgurJsonUsable() returns correct boolean", () => {
  it("should return true if json object contains a link to an image, has an id and the correct mime type", () => {
    expect(isImgurJsonUsable(memeResponseWithImage)).toBeTruthy();
  });

  it("should return false if json doesn't contain an id", () => {
    const actualMemeWithMissingId = { id: null, link: "https://example.com", type: "image/jpeg" };
    expect(isImgurJsonUsable(actualMemeWithMissingId)).toBeFalsy();
  });

  it("should return false if json doesn't contain a link", () => {
    const actualMemeWithMissingLink = { id: "123456", link: null, type: "image/jpeg" };
    expect(isImgurJsonUsable(actualMemeWithMissingLink)).toBeFalsy();
  });

  it("should return false if json doesn't contain a wrong mime type", () => {
    const actualMemeWithWrongMimeType = { id: "123456", link: "https://example.com", type: "video/mp4" };
    expect(isImgurJsonUsable(actualMemeWithWrongMimeType)).toBeFalsy();
  });
});
