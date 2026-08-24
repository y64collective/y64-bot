const { EmbedBuilder } = require('discord.js');

const COLORS = {
  default: 0x0a0a0a,
  error: 0xef4444,
};

function buildEmbed({
  title,
  description,
  color = COLORS.default,
  fields,
  footer,
} = {}) {
  const embed = new EmbedBuilder().setColor(color).setTimestamp();
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (fields) embed.addFields(fields);
  if (footer) embed.setFooter({ text: footer });
  return embed;
}

module.exports = { buildEmbed, COLORS };
