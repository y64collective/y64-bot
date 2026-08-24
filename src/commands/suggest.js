const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { buildEmbed, COLORS } = require('../utils/embeds');
const { SUGGESTION_CHANNEL_ID } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit a suggestion')
    .addStringOption((option) =>
      option
        .setName('suggestion')
        .setDescription('What should change')
        .setRequired(true)
        .setMaxLength(1000),
    ),

  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion', true);

    try {
      const channel = await interaction.client.channels.fetch(
        SUGGESTION_CHANNEL_ID,
      );
      const message = await channel.send({
        embeds: [
          buildEmbed({
            title: 'Suggestion',
            description: suggestion,
            footer: `Submitted by ${interaction.user.username}`,
          }),
        ],
      });
      await message.react('👍');
      await message.react('👎');

      await interaction.reply({
        embeds: [buildEmbed({ description: 'Your suggestion was submitted' })],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error('Failed to submit suggestion:', error.message);
      await interaction.reply({
        embeds: [
          buildEmbed({
            description: "Couldn't submit your suggestion",
            color: COLORS.error,
          }),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
