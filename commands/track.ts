import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import queries from "../db/queries";
import { db } from "../db/dbInit";
import {
  pickEmoji,
  toDiscordTime,
  isSprintWeekend,
} from "../utils/commandUtils";

export default {
  data: new SlashCommandBuilder()
    .setName("track")
    .setDescription("Sends the schedule for the specified race")
    .addStringOption((option) => {
      return option
        .setName("id")
        .setDescription(
          "The id of the track, you can find this by running `/tracks`"
        )
        .setRequired(false)
        .setMinLength(1);
    })
    .addStringOption((option) => {
      return option
        .setName("location")
        .setDescription("The location of the race")
        .setRequired(false)
        .setMinLength(3);
    }),
  async execute(interaction: any) {
    const location = interaction.options.getString("location");
    const id = interaction.options.getString("id");

    if (location && id) {
      interaction.reply("Please only use one of `location` or `id`.", {
        ephemeral: true,
      });
      return;
    }

    if (!location && !id) {
      interaction.reply("Please provide either `location` or `id`.", {
        ephemeral: true,
      });
      return;
    }

    let race;

    if (id) {
      race = await queries.getRace(db, id);
    } else {
      race = await queries.getRaceByLocation(db, location);
    }

    if (!race) {
      interaction.reply("No track found for that location.", {
        ephemeral: true,
      });
      return;
    }

    const trackEmbed = new EmbedBuilder();

    trackEmbed.setTitle(`The ${race.race.summary} full schedule:`);

    // casting the events as any as Event[] to satisfy the type checker, we know that it's an array of Event
    if (isSprintWeekend(race.events as any as Event[])) {
      trackEmbed.setDescription("This is a sprint weekend!");
    }

    race.events.forEach((event) => {
      trackEmbed.addFields({
        name: `${pickEmoji(event.type)} **${event.type}** ${toDiscordTime(
          event.startTime
        )}`,
        value: "\u200B", // Non-breaking space for empty value
      });
    });

    trackEmbed.setThumbnail(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/2560px-F1.svg.png"
    );
    trackEmbed.setColor("#f50000");

    interaction.reply({ embeds: [trackEmbed] });
  },
};
