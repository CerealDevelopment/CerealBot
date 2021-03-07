# CerealBot

> Only for the most Cereal people

## NPM commands

```sh
npm start # Start server 
npm run build # Build server to lib
npm test # Run tests 
npm run pretty # Consistent formatting
npm run clean # Remove node modules
npm run clean-install # Clean and reinstall node modules
```

## ConfigFile

Current required items in config.json:

```json
{
    "BOT_TOKEN": "<Your token>",
    "PREFIX": "<Your preferred command prefix like '!'  or '#'>"
}
```

## Docker

**BUILD**

`docker build . -t cereal_bot`

**RUN**

`docker run -d -v $(pwd)/config.json:/opt/cerealbot/config.json cereal_bot:latest` 