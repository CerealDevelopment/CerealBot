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

## Used resources 

### Sounds 

The sound effects are provided by: 

1. Mike Koening
  - [Airhorn](https://soundbible.com/1542-Air-Horn.html#)
  - [Fog Horn](https://soundbible.com/1594-Fog-Horn.html)
2. Daniel Simion
  - [Fire Truck](https://soundbible.com/2192-Fire-Truck-Horn.html)
