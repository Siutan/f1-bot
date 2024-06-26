import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import queries from "../db/queries";
import { db } from "../db/dbInit";
import { timeDifference } from "../utils/commandUtils";
import { getConstructorStandings, getDriverStandings } from "../utils/scraper";

export default {
  data: new SlashCommandBuilder()
    .setName("when")
    .setDescription("Sends the time until the next race"),
  async execute(interaction: any) {
    const time = await queries.getTimeUntilNextRace(db);

    if (!time) {
      interaction.reply("No upcoming races found.", { ephemeral: true });
      return;
    }
    const parsedTime = timeDifference(new Date(), time.grandPrixTime);

    const whenEmbed = new EmbedBuilder();

    whenEmbed.setTitle(`🕒 The ${time.nextRace.summary}`);

    whenEmbed.addFields({
      // return time like 2 days, 2 hours and 3 minutes
      name: `🚦 Lights out in ${parsedTime}`,
      value: "\u200B", // Non-breaking space for empty value
    });

    whenEmbed.setThumbnail(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/2560px-F1.svg.png"
    );
    whenEmbed.setColor("#f50000");

    interaction.reply({ embeds: [whenEmbed] });
  },
};
