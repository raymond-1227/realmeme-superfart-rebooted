require.extensions['.jsonc'] = function (module, filename) {
  const fs = require('fs');
  module.exports = fs.readFileSync(filename, 'utf8');
};

const Discord = require('discord.js');
const Config = require('./Config');

const Log = require('./Utils/Log');

const CommandHandlers = require('./Commands');
const setUpRichPresence = require('./RichPresence/setUpRichPresence');

let totalErrorsThisSession = 0;

function newError() {
  totalErrorsThisSession += 1;
}

function errorCount() {
  return totalErrorsThisSession;
}

const client = new Discord.Client();

client.on('ready', () => {
  Log(`Logged in as ${client.user.tag}!`, Log.SEVERITY.SUCCESS);

  setUpRichPresence(client);
});

client.on('message', (msg) => {
  const whitelistedChannels = Config.resources.channelIds.whitelistedChannels;
  const WhitelistEnabled = whitelistedChannels.length > 0;

  // Not a DM or message in whitelisted channels
  if (msg.channel.type !== 'dm' && (!WhitelistEnabled || !whitelistedChannels.includes(msg.channel.id))) {
    return;
  }

  // It's me!
  if (msg.author.id === client.user.id) {
    return;
  }

  // It's one of me!
  if (msg.author.bot) {
    Log(
      `Ignoring message from bot in channel '#${msg.channel.name}' in server '${msg.guild.name}'`,
      Log.SEVERITY.VERBOSE
    );
    return;
  }

  // Iterate through command handlers until one is triggered
  CommandHandlers.every(async (handler) => {
    const result = await handler(msg, client);

    // break for loop if command gets handled
    if (result) return false;
    else return true;
  });
});

// Login!
client.login(Config.token);

module.exports.AddError = newError;
module.exports.GetErrorCount = errorCount;
