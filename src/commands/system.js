const { SlashCommandBuilder } = require('discord.js');
const si = require('systeminformation');
const { buildEmbed, COLORS } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('system')
    .setDescription("Show the bot's CPU/RAM/network usage"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const [cpu, mem, [net]] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.networkStats(),
      ]);

      const ramUsedGB = mem.active / 1024 ** 3;
      const ramTotalGB = mem.total / 1024 ** 3;
      const ramPercent = (mem.active / mem.total) * 100;

      const downloadMBs = (net?.rx_sec ?? 0) / (1024 * 1024);
      const uploadMBs = (net?.tx_sec ?? 0) / (1024 * 1024);

      await interaction.editReply({
        embeds: [
          buildEmbed({
            title: 'System Usage',
            fields: [
              {
                name: 'CPU',
                value: `${cpu.currentLoad.toFixed(0)}%`,
              },
              {
                name: 'RAM',
                value: `${ramUsedGB.toFixed(1)} / ${ramTotalGB.toFixed(1)} GB (${ramPercent.toFixed(0)}%)`,
              },
              {
                name: 'Download',
                value: `${downloadMBs.toFixed(2)} MB/s`,
              },
              {
                name: 'Upload',
                value: `${uploadMBs.toFixed(2)} MB/s`,
              },
            ],
          }),
        ],
      });
    } catch (error) {
      console.error('Failed to fetch system usage:', error.message);
      await interaction.editReply({
        embeds: [
          buildEmbed({
            title: 'System Usage',
            description: "Couldn't read the system usage",
            color: COLORS.error,
          }),
        ],
      });
    }
  },
};
