const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { buildEmbed } = require('../utils/embeds');
const { DOMAIN } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Show the Minecraft server address'),

  async execute(interaction) {
    await interaction.reply({
      embeds: [
        buildEmbed({
          title: 'Server Address',
          description: `\`${DOMAIN}\``,
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
};
