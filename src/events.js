const { MessageFlags } = require('discord.js');
const { commands, commandData } = require('./commands/registry');
const { buildEmbed, COLORS } = require('./utils/embeds');
const {
  COMMANDS_CHANNEL_ID,
  ALLOWED_INVITE_SENDER_ID,
  AUTO_ROLE_ID,
} = require('./config');
const { startStatusRotation } = require('./status');

const commandMap = new Map(
  commands.map((command) => [command.data.name, command]),
);
const UNRESTRICTED_COMMANDS = new Set(['purge', 'ip', 'suggest', 'bugreport']);
const INVITE_LINK_PATTERN =
  /\b(?:discord\.gg|discord(?:app)?\.com\/invite)\/\S+/i;

const ready = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    client.application.commands.set(commandData).catch((error) => {
      console.error('Failed to register commands:', error.message);
    });
    startStatusRotation(client);
  },
};

const interactionCreate = {
  name: 'interactionCreate',
  once: false,
  execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);
    if (!command) return;

    if (
      !UNRESTRICTED_COMMANDS.has(interaction.commandName) &&
      interaction.channelId !== COMMANDS_CHANNEL_ID &&
      interaction.user.id !== ALLOWED_INVITE_SENDER_ID
    ) {
      interaction
        .reply({
          embeds: [
            buildEmbed({
              title: 'Wrong Channel',
              description: `Please use commands in <#${COMMANDS_CHANNEL_ID}>`,
              color: COLORS.error,
            }),
          ],
          flags: MessageFlags.Ephemeral,
        })
        .catch((error) => {
          console.error(
            'Failed to send channel restriction notice:',
            error.message,
          );
        });
      return;
    }

    command.execute(interaction).catch((error) => {
      console.error(
        `Failed to execute command ${interaction.commandName}:`,
        error.message,
      );
    });
  },
};

const guildMemberAdd = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    try {
      await member.roles.add(AUTO_ROLE_ID);
      console.log(`Assigned auto-role to ${member.user.tag}`);
    } catch (error) {
      console.error(
        `Failed to assign auto-role to ${member.user.tag}:`,
        error.message,
      );
    }
  },
};

const messageCreate = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (message.author.bot) return;

    if (message.channelId === COMMANDS_CHANNEL_ID) {
      try {
        await message.delete();
        const notice = await message.channel.send({
          embeds: [
            buildEmbed({
              title: 'Commands Only',
              description: 'Please use commands only',
              color: COLORS.error,
            }),
          ],
        });
        setTimeout(() => {
          notice.delete().catch((error) => {
            console.error(
              'Failed to remove commands-only notice:',
              error.message,
            );
          });
        }, 5000);
      } catch (error) {
        console.error('Failed to remove non-command message:', error.message);
      }
      return;
    }

    if (message.author.id === ALLOWED_INVITE_SENDER_ID) return;
    if (!INVITE_LINK_PATTERN.test(message.content)) return;

    try {
      await message.delete();
      await message.channel.send({
        embeds: [
          buildEmbed({
            title: 'Invite Removed',
            description: `The invite link from ${message.author} was removed`,
            color: COLORS.error,
          }),
        ],
      });
    } catch (error) {
      console.error('Failed to remove Discord invite:', error.message);
    }
  },
};

const clientError = {
  name: 'error',
  once: false,
  execute(error) {
    console.error('Client error:', error.message);
  },
};

module.exports = [
  ready,
  interactionCreate,
  guildMemberAdd,
  messageCreate,
  clientError,
];
