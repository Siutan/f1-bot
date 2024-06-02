import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import queries from "../db/queries";
import { db } from "../db/dbInit";
import { channel } from "diagnostics_channel";

const scheduleEmbed = new EmbedBuilder().setColor(0x0099ff);

const pickEmoji = (label: string) => {
  label = label.toLowerCase();
  if (label.includes("fp")) {
    return "🚦";
  } else if (label.includes("qualifying")) {
    return "⏱";
  } else if (label.includes("grand prix")) {
    return "🏁";
  } else {
    return "🚦";
  }
};

const formatDate = (date: Date) => {
  return `${date.toLocaleString("en-US", {
    month: "long",
  })} ${date.getDate()}, ${date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;
};

export default {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Sends the schedule for the next race"),
  async execute(interaction: any) {
    const race = await queries.getNextRace(db);
    if (!race) {
      interaction.reply("No upcoming races found.");
      return;
    }

    scheduleEmbed.setTitle(`The ${race.nextRace.summary} full schedule:`);

    for (const event of race.events) {
      scheduleEmbed.addFields({
        name:
          "" +
          " " +
          `${pickEmoji(event.type)}` +
          " " +
          event.type +
          " ` " +
          `${formatDate(event.startTime)}` +
          " ` ",
        value: " ",
      });
    }

    interaction.reply({ embeds: [scheduleEmbed] });
  },
};
