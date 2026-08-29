# Jarvis

Jarvis is a Discord bot with music, moderation, greeting, and utility commands.

## Requirements

- Node.js 22.12 or newer
- npm
- A Discord bot token
- `yt-dlp` installed and available on `PATH`

The bot uses `ffmpeg-static` through Discord's audio stack, so a separate FFmpeg installation is not required for the standard setup.

## Setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   DISCORD_TOKEN=your_bot_token
   ```

3. In the Discord developer portal, enable the Message Content and Server Members privileged gateway intents.

4. Give the bot the permissions needed by the commands you plan to use. Music requires Connect and Speak; moderation requires Move Members or Kick Members.

5. Start the bot:

   ```sh
   npm start
   ```

For development with automatic restarts, use `npm run dev`.

## Commands

Commands are triggered by mentioning `jarvis` in a message, for example `jarvis play never gonna give you up`.

- `hello`, `hey`, `hi`, `yo`
- `help`
- `play <song or URL>`
- `pause`, `resume`, `skip`, `stop`, `queue`
- `joke`, `flip <heads|tails>`, `roll`, `hug`, `clap`
- `kick <username> <server|call>`

## Deployment

The included PM2 configuration runs the compiled `dist/index.js` entry point and writes runtime output under `logs/`.

```sh
npm run pm2:start
```

PM2 must be installed separately and available on `PATH`.

## Checks

```sh
npm run build
npm exec -- tsc --noEmit
```
