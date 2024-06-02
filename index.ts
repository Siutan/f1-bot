import { Client, Events, GatewayIntentBits } from "discord.js";
import { commandHolder, registerCommands } from "./commandsUtility";
import { getEvents } from "./utils/calenderParser";
import { db } from "./db/dbInit";
const token = process.env.BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

db.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log("Database initialized", __dirname);
    registerCommands();
    getEvents(db);

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      console.log(interaction.commandName);
      const command = commandHolder.get(interaction.commandName);
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });

    client.once(Events.ClientReady, (c) => {
      console.log(`${c.user.tag} is ready!`);
    });

    client.login(token);
  })
  .catch((error) => console.log(error));
