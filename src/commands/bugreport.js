const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { buildEmbed, COLORS } = require('../utils/embeds');
const { BUG_REPORT_CHANNEL_ID } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Report a bug')
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('What went wrong')
        .setRequired(true)
        .setMaxLength(1000),
    ),

  async execute(interaction) {
    const description = interaction.options.getString('description', true);

    try {
      const channel = await interaction.client.channels.fetch(
        BUG_REPORT_CHANNEL_ID,
      );
      const message = await channel.send({
        embeds: [
          buildEmbed({
            title: 'Bug Report',
            description,
            footer: `Reported by ${interaction.user.username}`,
          }),
        ],
      });
      await message.react('🙋');

      await interaction.reply({
        embeds: [buildEmbed({ description: 'Your bug report was submitted' })],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error('Failed to submit bug report:', error.message);
      await interaction.reply({
        embeds: [
          buildEmbed({
            description: "Couldn't submit your bug report",
            color: COLORS.error,
          }),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
