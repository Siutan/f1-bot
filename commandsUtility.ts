import { Collection } from "discord.js";
import { readdir } from "node:fs/promises";

export let commandHolder = new Collection<string, any>();

// register all commands from ./commands
export async function registerCommands() {
    const commandFiles = await readdir("./commands");
    for (const file of commandFiles) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        try {
          const { default: command } = await import(`./commands/${file}`);
          // Set a new item in the Collection with the key as the command name and the value as the exported module
          if ("data" in command && "execute" in command) {
            commandHolder.set(command.data.name, command);
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

