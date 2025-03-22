import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("info").setDescription("Bot info"),
  async execute(interaction: any) {
    const infoEmbed = new EmbedBuilder();

    infoEmbed.setTitle("Bot Info");
    infoEmbed.setDescription(
      "This bot was made by [Siutan](https://github.com/Siutan) and is powered by [Discord.js](https://discord.js.org/)."
    );

    infoEmbed.addFields({
      name: "👨🏾‍💻 Source Code",
      value: "https://github.com/Siutan/f1-bot",
    });

    infoEmbed.addFields({
      name: "🏓 Ping",
      value: `${interaction.client.ws.ping}ms`,
    });

    infoEmbed.addFields({
      name: "⏰ Uptime",
      value: `${Math.round(process.uptime() / 60)} minutes`,
    });

    infoEmbed.addFields({
      name: "💿 Server Count",
      value: `${interaction.client.guilds.cache.size}`,
    });

    infoEmbed.addFields({
      name: "🖥️ CPU",
      value: `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`,
    });
    infoEmbed.addFields({
      name: "🖥️ Memory",
      value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
    });

    infoEmbed.setThumbnail(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1.svg/2560px-F1.svg.png"
    );
    infoEmbed.setColor("#f50000");
    infoEmbed.setFooter({
      text: "I am in love with Charles Leclerc.",
    });

    interaction.reply({ embeds: [infoEmbed] });
  },
};
