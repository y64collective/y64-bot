const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show information about a user')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to look up'),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    await interaction.deferReply();

    const member = interaction.guild
      ? await interaction.guild.members.fetch(user.id).catch(() => null)
      : null;

    const fields = [
      { name: 'Username', value: user.username },
      { name: 'ID', value: `\`${user.id}\`` },
    ];

    if (member?.joinedTimestamp) {
      fields.push({
        name: 'Joined Server',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`,
      });
    }

    fields.push({
      name: 'Account Created',
      value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`,
    });

    await interaction.editReply({
      embeds: [
        buildEmbed({ title: 'User Info', fields }).setThumbnail(
          user.displayAvatarURL(),
        ),
      ],
    });
  },
};
