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

`docker run -d -v "$(pwd)/config.json:/opt/cerealbot/config.json" cereal_bot:latest`

**PULL**

`docker pull cerealdevelopment/cerealbot`

or

`docker pull cerealdevelopment/cerealbot:latest`

**PUSH**

`tba`

## Used resources 

### Sounds 

The sound effects are provided by: 

1. Mike Koening
  - [Airhorn](https://soundbible.com/1542-Air-Horn.html)
  - [Fog Horn](https://soundbible.com/1594-Fog-Horn.html)
  - [Cow Moo](https://soundbible.com/1778-Cow-Moo.html)
2. Daniel Simion
  - [Fire Truck](https://soundbible.com/2192-Fire-Truck-Horn.html)
  - [Dixie Horn](https://soundbible.com/2179-Dixie-Horn.html)
3. snootyboy
  - [Warning Siren](https://soundbible.com/1355-Warning-Siren.html)
4. StickInTheMud
  - [Bike Horn](https://soundbible.com/1446-Bike-Horn.html)
5. Daveincammas
  - [Police Siren](https://soundbible.com/1233-Siren.html)