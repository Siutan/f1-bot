# F1 - Bot
A Discord bot made out of frustration that another f1 bot we were using, wasn't working.

## Commands

 - **/schedule**
	 - Gets the next upcoming race details for the weekend. This includes the date, time, and location of the race.
 - **/remind [time] [event]**
	 - Sets a reminder for a specified number of minutes before the specified event. For example, `/remind 30 Qualifying` will remind you 30 minutes before the qualifying session.
 - **/predict [winner]**
	 - Takes a driver name and adds it to the prediction pool. If your predicted driver wins, you earn points!

*Note: The `remind` and `predict` commands are currently under development and will be available in future updates.*

## Getting Started

To get the bot up and running, follow these steps:

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Siutan/f1-bot.git
   cd f1-bot
   ```

**You may replace bun with your package manager of choice in the following steps**

2. Install dependencies:
   ```sh
   bun i
   ```

3. Set up the commands for the bot:
   ```sh
   bun commands # Use --global if deploying across multiple servers
   ```

4. Start the bot:
   ```sh
   bun start # only start after configuration, see below
   ```

### Configuration

Before starting the bot, ensure you have configured the necessary environment variables. Create a `.env` file in the root directory of the project with the following variables:

```plaintext
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
```

Replace `your_discord_bot_token` with your actual Discord bot token. You can get this from the [Discord Developer Portal](https://discord.com/developers/applications).

*note:* `client id` and `guild id` are only used in `commandsDeploy.ts` to push your command configs.

The bot should now be online and responding to commands in your Discord server.

## Contribution

We welcome contributions to enhance the bot's functionality. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Support

For any issues or questions, please open an issue on the [GitHub repository](https://github.com/Siutan/f1-bot/issues).

---