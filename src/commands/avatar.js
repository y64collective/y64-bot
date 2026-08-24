const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Show a user's avatar")
    .addUserOption((option) =>
      option.setName('user').setDescription('The user whose avatar to show'),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;

    await interaction.reply({
      embeds: [
        buildEmbed({ title: `${user.username}'s Avatar` }).setImage(
          user.displayAvatarURL({ size: 1024 }),
        ),
      ],
    });
  },
};
