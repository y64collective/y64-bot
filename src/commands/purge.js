const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require('discord.js');
const { buildEmbed, COLORS } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete recent messages in this channel')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount', true);

    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const deleted = await interaction.channel.bulkDelete(amount, true);

      if (deleted.size === 0) {
        await interaction.editReply({
          embeds: [
            buildEmbed({
              title: 'Purge',
              description: 'No messages were deleted',
            }),
          ],
        });
        return;
      }

      await interaction.editReply({
        embeds: [
          buildEmbed({
            title: 'Purge',
            description: `Deleted **${deleted.size}** ${deleted.size === 1 ? 'message' : 'messages'}`,
          }),
        ],
      });
    } catch (error) {
      console.error('Failed to purge messages:', error.message);
      await interaction.editReply({
        embeds: [
          buildEmbed({
            title: 'Purge',
            description: "Couldn't delete those messages",
            color: COLORS.error,
          }),
        ],
      });
    }
  },
};
