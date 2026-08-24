const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const { Client, GatewayIntentBits } = require('discord.js');

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const events = require('./src/events');

for (const event of events) {
  const handler = (...args) => event.execute(...args);
  if (event.once) {
    client.once(event.name, handler);
  } else {
    client.on(event.name, handler);
  }
}

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

client.login(DISCORD_TOKEN).catch((error) => {
  console.error("Couldn't log in with DISCORD_TOKEN:", error.message);
  process.exit(1);
});

async function shutdown() {
  console.log('Shutting down...');
  await client.destroy();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
