# CerealBot

> Only for the most Cereal people

[![Node.js CI](https://github.com/CerealDevelopment/CerealBot/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/CerealDevelopment/CerealBot/actions/workflows/main.yml)
[![Docker CI](https://github.com/CerealDevelopment/CerealBot/actions/workflows/docker.yml/badge.svg?branch=master)](https://github.com/CerealDevelopment/CerealBot/actions/workflows/docker.yml)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/CerealDevelopment/CerealBot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/CerealDevelopment/CerealBot/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/CerealDevelopment/CerealBot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/CerealDevelopment/CerealBot/alerts/)

A Discord Bot for memes, airhorn noises and even more cereal things!

## NPM commands

```sh
npm start # Start server
npm run build # Build server to lib
npm test # Run tests
npm run pretty # Consistent formatting
npm run clean # Remove node modules
npm run clean-install # Clean and reinstall node modules
```

## Docker

Useful Docker commands are added to the `package.json`:

```sh
npm run docker-pull
npm run docker-build
npm run docker-push
npm run docker-run
```

The repository used to store the Docker image is [here](https://github.com/CerealDevelopment/CerealBot/pkgs/container/cerealbot) on Github.

## Configuration

Passwords and tokens are passed with environment variables. To connect the bot to Discord a `BOT_TOKEN` is required.

General configuration is done through the `config.json`.

### ConfigFile

Current required items in config.json:

```json
{
    "DISCORD": {
        "PREFIX": "!",
        "MAX_PREFIX_LENGTH": 3,
        "EMBED": {
            "DESC_CHAR_LIMIT": 2048,
            "FIELD_CHAR_LIMIT": 1024,
            "TITLE_CHAR_LIMIT": 256
        }
    },
    "DATABASE": {
        "PATH_TO_MIGRATION_FILES": "./lib/data/migrations"
    },
    "AUDIO_FILE_FORMAT": ".ogg",
    "IMGUR": {
        "AUTHORIZATION": "Client-ID <API_KEY>",
        "URL": "https://api.imgur.com/3/gallery/t/meme/top/week/1"
    },
    "HACKERNEWS": {
        "BASE_URL": "https://hacker-news.firebaseio.com/v0",
        "BESTSTORIES": "/beststories",
        "STORY": "/item/",
        "URL_SUFFIX": ".json",
        "COMMENT_URL": "https://news.ycombinator.com/item?id="
    },
    "URBAN": {
        "URL": "https://api.urbandictionary.com/v0/define?"
    },
    "COCKTAIL": {
        "BASE_URL": "https://www.thecocktaildb.com/api/json/",
        "API_VERSION": "v1/",
        "API_KEY": "1/",
        "RANDOM_URL": "random.php",
        "SEARCH_INGREDIENT": "filter.php?i=",
        "SEARCH_LETTER_URL": "search.php?f=",
        "SEARCH_URL": "search.php?s="
    },
    "MEME": {
        "SYNC_AT_MIDNIGHT": "0 0 * * *",
        "TABLE_NAME": "meme"
    }
}
```

## Converting audio types

Using `opusenc` it is very simple to convert a `.wav` to `opus/.ogg`:

`opusenc --bitrate 256 <input_file.wav> <output_file.ogg>`

## Testing

To run the tests, use `npm run tests`. Some of the tests are property based tests using `fast-check`. It requires a rerun with a specific seed, in case a test fails. Please consult the official docs on how to replay a seed: https://github.com/dubzzz/fast-check/blob/main/documentation/Tips.md#replay-after-failure.

## Used resources

### Pictures

- Bru-No

  - [Empty bottle](https://pixabay.com/photos/bottle-empty-depleted-consumes-3551162/)

### Sounds

The sound effects are provided by:

- Mike Koening

  - [Airhorn](https://soundbible.com/1542-Air-Horn.html)
  - [Fog Horn](https://soundbible.com/1594-Fog-Horn.html)
  - [Cow Moo](https://soundbible.com/1778-Cow-Moo.html)

- Daniel Simion

  - [Fire Truck](https://soundbible.com/2192-Fire-Truck-Horn.html)
  - [Dixie Horn](https://soundbible.com/2179-Dixie-Horn.html)

- snootyboy

  - [Warning Siren](https://soundbible.com/1355-Warning-Siren.html)

- StickInTheMud

  - [Bike Horn](https://soundbible.com/1446-Bike-Horn.html)

- Daveincammas
  - [Police Siren](https://soundbible.com/1233-Siren.html)
