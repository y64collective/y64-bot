const ping = require('./ping');
const userinfo = require('./userinfo');
const avatar = require('./avatar');
const system = require('./system');

const mcstatus = require('./mcstatus');
const ip = require('./ip');

const suggest = require('./suggest');
const bugreport = require('./bugreport');

const purge = require('./purge');

const commands = [
  // General
  ping,
  userinfo,
  avatar,
  system,
  // Minecraft
  mcstatus,
  ip,
  // Community
  suggest,
  bugreport,
  // Moderation
  purge,
];

module.exports = {
  commands,
  commandData: commands.map((command) => command.data),
};
