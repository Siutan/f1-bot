import { REST, Routes } from "discord.js";
import { readdir } from "node:fs/promises";
import { parseArgs } from "util";

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error("Missing environment variables");
  process.exit(1);
}

let args: { global?: boolean } = {};
try {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      global: {
        type: "boolean",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  args = values;
} catch (error) {
  console.error("Unknown Arg", Bun.argv.slice(2));
  process.exit(1);
}

const commands: any[] = [];

export async function registerCommands() {
  const commandFiles = await readdir("./commands");
  for (const file of commandFiles) {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      try {
        const { default: command } = await import(`./commands/${file}`);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
          console.log("Command loaded: " + command.data.name);
        } else {
          console.log(
            `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
          );
        }
      } catch (error) {
        console.error(`Error loading command ${file}:`, error);
      }
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    await registerCommands();
    // check if global
    if (args.global) {
      console.log("Deploying commands to global...");
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      console.log("Successfully reloaded global application (/) commands.");
      return;
    }

    console.log("Deploying commands to guild...");
    console.log("If you want to deploy commands globally, use --global flag");
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
