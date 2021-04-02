# CerealBot

> Only for the most Cereal people

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

## Configuration

Passwords and tokens are passed with environment variables. To connect the bot to Discord a `BOT_TOKEN` is required.

General configuration is done through the `config.json`.

### ConfigFile

Current required items in config.json:

```json
{
  "BOT_TOKEN": "<Your token>",
  "PREFIX": "<Your preferred command prefix like '!'  or '#'>"
}
```

## Converting audio types

Using `opusenc` it is very simple to convert a `.wav` to `opus/.ogg`:

`opusenc --bitrate 256 <input_file.wav> <output_file.ogg>`

## Used resources

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
