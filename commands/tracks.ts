import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import queries from "../db/queries";
import { db } from "../db/dbInit";

export default {
  data: new SlashCommandBuilder()
    .setName("tracks")
    .setDescription("Sends all the tracks for the calendar"),
  async execute(interaction: any) {
    const races = await queries.getRaces(db);
    if (!races) {
      interaction.reply("No tracks found.", { ephemeral: true });
      return;
    }
    
    const tracksEmbed = new EmbedBuilder();

    tracksEmbed.setTitle(`${races.length}`);
    tracksEmbed.setDescription(
      "List of all tracks, you can use `/track <id>` to get more info."
    );

    races.forEach((race) => {
      tracksEmbed.addFields({
        name: `${race.summary}`,
        value: `**ID**: ${race.id} \n**Location**: ${race.location} \n`,
      });
    });

    tracksEmbed.setThumbnail(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/2560px-F1.svg.png"
    );
    tracksEmbed.setColor("#f50000");

    interaction.reply({ embeds: [tracksEmbed] });
  },
};
