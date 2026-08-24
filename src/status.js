const { ActivityType } = require('discord.js');
const si = require('systeminformation');
const { MINECRAFT_SERVER_ADDRESS, WEBSITE_URL } = require('./config');
const { fetchServerStatus } = require('./statusApi');

const STATUS_INTERVAL_MS = 30_000;
const STATUS_STEPS = 5;
let statusIndex = 0;

async function nextStatusText() {
  switch (statusIndex) {
    case 1: {
      return `Web: ${WEBSITE_URL}`;
    }
    case 2: {
      const data = await fetchServerStatus();
      return `Server: ${data.online ? 'Online' : 'Offline'}`;
    }
    case 3: {
      const { currentLoad } = await si.currentLoad();
      return `CPU: ${currentLoad.toFixed(0)}%`;
    }
    case 4: {
      const { active, total } = await si.mem();
      return `RAM: ${((active / total) * 100).toFixed(0)}%`;
    }
    default:
      return `IP: ${MINECRAFT_SERVER_ADDRESS}`;
  }
}

async function updateStatus(client) {
  try {
    const text = await nextStatusText();
    client.user.setActivity(text, { type: ActivityType.Watching });
  } catch (error) {
    console.error('Failed to update status:', error.message);
  } finally {
    statusIndex = (statusIndex + 1) % STATUS_STEPS;
  }
}

function startStatusRotation(client) {
  updateStatus(client);
  setInterval(() => updateStatus(client), STATUS_INTERVAL_MS);
}

module.exports = { startStatusRotation };
