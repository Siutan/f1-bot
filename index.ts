import { Client, Events, GatewayIntentBits } from "discord.js";
import { commandHolder, registerCommands } from "./commandsUtility";
import { getEvents } from "./utils/calenderParser";
import { db } from "./db/dbInit";

// listen for process exit, this is mainly for debugging
process.on("exit", (code) => {
  console.log("Exiting with code:", code);
});

const token = process.env.BOT_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

db.initialize()
  .then(() => {
    registerCommands();
    getEvents();

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
