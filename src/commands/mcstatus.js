const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, COLORS } = require('../utils/embeds');
const { DOMAIN } = require('../config');
const { fetchServerStatus } = require('../statusApi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcstatus')
    .setDescription('Show the Minecraft server status'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const data = await fetchServerStatus();

      if (!data.online) {
        await interaction.editReply({
          embeds: [
            buildEmbed({
              title: 'Server Status',
              color: COLORS.error,
              fields: [
                {
                  name: 'Address',
                  value: `\`${DOMAIN}\``,
                },
                {
                  name: 'Status',
                  value: 'Offline',
                },
              ],
            }),
          ],
        });
        return;
      }

      await interaction.editReply({
        embeds: [
          buildEmbed({
            title: 'Server Status',
            fields: [
              {
                name: 'Address',
                value: `\`${DOMAIN}\``,
              },
              {
                name: 'Status',
                value: 'Online',
              },
              {
                name: 'Version',
                value: `${data.version?.protocol ?? 'Unknown'}`,
              },
              {
                name: 'Players',
                value: `${data.players?.online ?? 0} / ${data.players?.max ?? 0}`,
              },
            ],
          }),
        ],
      });
    } catch (error) {
      console.error('Failed to fetch server status:', error.message);
      await interaction.editReply({
        embeds: [
          buildEmbed({
            title: 'Server Status',
            description: "Couldn't reach the status API",
            color: COLORS.error,
          }),
        ],
      });
    }
  },
};
