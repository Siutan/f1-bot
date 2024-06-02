import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import queries from "../db/queries";
import { db } from "../db/dbInit";

const scheduleEmbed = new EmbedBuilder();

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
  // convert to epoch
  const epoch = Math.floor(date.getTime() / 1000);
  return `<t:${epoch}:f>`;
};

const isSprintWeekend = (events: Event[]) => {
  return events.some((event) => {
    return event.type.includes("sprint");
  });
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

    // casting the events as any as Event[] to satisfy the type checker, we know that it's an array of Event
    if (isSprintWeekend(race.events as any as Event[])) {
      scheduleEmbed.setDescription("This is a sprint weekend!");
    }

    for (const event of race.events) {
      scheduleEmbed.addFields({
        name: `${pickEmoji(event.type)} **${event.type}** ${formatDate(
          event.startTime
        )}`,
        value: "\u200B", // Non-breaking space for empty value
      });
    }

    scheduleEmbed.setThumbnail(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/2560px-F1.svg.png"
    );
    scheduleEmbed.setColor("#f50000");

    interaction.reply({ embeds: [scheduleEmbed] });
  },
};
