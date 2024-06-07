import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getConstructorStandings, getDriverStandings } from "../utils/scraper";

type StandingsType = "driver" | "constructor";

export default {
  data: new SlashCommandBuilder()
    .setName("standings")
    .setDescription("Sends the standings for the next race")
    .addStringOption((option) => {
      return option
        .setName("type")
        .setDescription("The type of standings to get")
        .setRequired(true)
        .addChoices([
          { name: "Driver", value: "driver" },
          { name: "Constructor", value: "constructor" },
        ]);
    }),
  async execute(interaction: any) {
    const type = interaction.options.getString("type") as StandingsType;

    let standings;

    if (type === "driver") {
      standings = await getDriverStandings();
    } else if (type === "constructor") {
      standings = await getConstructorStandings();
    }

    if (!standings) {
      interaction.reply(
        "An error occurred while fetching the standings. Please report this to me on [GitHub](https://github.com/Siutan/f1-bot/issues).",
        {
          ephemeral: true,
        }
      );
      return;
    }

    const standingsEmbed = new EmbedBuilder();

    standingsEmbed.setTitle(`📈 The ${type} standings`);

    let rank = 1;
    for (const standing of standings) {
      let medalEmoji = "";
      if (rank === 1) {
        medalEmoji = "🥇";
      } else if (rank === 2) {
        medalEmoji = "🥈";
      } else if (rank === 3) {
        medalEmoji = "🥉";
      }
      standingsEmbed.addFields({
        name: `${medalEmoji} ${standing.name}`,
        value: `**Points**: ${standing.points}`,
      });
      rank++;
    }

    standingsEmbed.setThumbnail(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/2560px-F1.svg.png"
    );
    standingsEmbed.setColor("#f50000");

    interaction.reply({ embeds: [standingsEmbed] });
  },
};
