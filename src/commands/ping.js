const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot latency'),

  async execute(interaction) {
    await interaction.deferReply();
    const roundTrip = Date.now() - interaction.createdTimestamp;
    const wsPing =
      interaction.client.ws.ping >= 0 ? interaction.client.ws.ping : 0;

    await interaction.editReply({
      embeds: [
        buildEmbed({
          title: 'Pong!',
          fields: [
            { name: 'Roundtrip', value: `${roundTrip} ms` },
            { name: 'Websocket', value: `${wsPing} ms` },
          ],
        }),
      ],
    });
  },
};
