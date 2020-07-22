const Permissions = require('../data/Permissions');
module.exports.commandInfo = {
  trigger: 'diagnostics',
  usage: 'diagnostics',
  aliases: [],
  name: 'Diagnostics',
  description: 'Get diagnostic info about the bot and Discord',
  permissionsNeeded: Permissions.Admin,
};

const moment = require('moment');
const fetch = require('node-fetch');

const Config = require('../Config');
const Log = require('../Utils/Log');

const AllowedUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

const { MessageEmbed } = require('discord.js');

module.exports.handler = async function Diagnostics(message, client, data) {
  const content = message.content.toLowerCase();

  if (content.startsWith(`${Config.commandPrefix}diagnostics`)) {
    const loadMsg = await message.channel.send(
      `${Config.resources.emojis.loading.code}  ${Config.resources.strings.loading} (⏱️ Initialising)`
    );

    // Unauthorised
    if (!AllowedUsers.includes(message.author.id)) {
      Log(
        `User ${message.author.username}#${message.author.discriminator} attempted to run 'diagnostics' (${message.author.id})`,
        Log.SEVERITY.WARN
      );

      loadMsg.edit(`${Config.resources.emojis.fail.code}  You don't have permission to use this command`);
      return true;
    }

    let beforeEdit = new Date();
    // Round trip ping
    await loadMsg.edit(
      `${Config.resources.emojis.loading.code}  ${Config.resources.strings.loading} (${Config.resources.emojis.ping.code} Calculating Discord API ping)`
    );
    let roundTripPing = loadMsg.createdAt - message.createdAt;

    // Discord API ping
    await loadMsg.edit(
      `${Config.resources.emojis.loading.code}  ${Config.resources.strings.loading} (${Config.resources.emojis.roundTripPing.code} Calculating ping to server)`
    );
    let apiPing = client.ws.ping;

    // Discord API status
    await loadMsg.edit(
      `${Config.resources.emojis.loading.code}  ${Config.resources.strings.loading} (${Config.resources.emojis.roundTripPing.code} Fetching Discord status)`
    );
    let discordStatusJson,
      discordStatusText = 'Unknown',
      discordStatusIcon = Config.resources.emojis.outageUnknown.code;
    try {
      discordStatusJson = await (await fetch('https://srhpyqt94yxb.statuspage.io/api/v2/status.json')).json();
      discordStatusText = discordStatusJson.status.description;

      switch (discordStatusJson.status.indicator) {
        case 'none':
          discordStatusIcon = Config.resources.emojis.outageNone.code;
          break;
        case 'minor':
          discordStatusIcon = Config.resources.emojis.outageMinor.code;
          break;
        case 'major':
          discordStatusIcon = Config.resources.emojis.outageMajor.code;
          break;
        case 'critical':
          discordStatusIcon = Config.resources.emojis.outageCritical.code;
          break;

        case 'unknown':
        default:
          discordStatusIcon = Config.resources.emojis.outageUnknown.code;
          break;
      }
    } catch (error) {
      Log(`Couldn't fetch Discord status: ` + error, Log.SEVERITY.WARN);
    }

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('Bot diagnostics')
      // Set the color of the embed
      .setColor(Config.colors.primary)
      // Set the main content of the embed
      .setDescription("Oops, did something go wrong? Here's some diagnostic info.")
      .addField(
        'Uptime',
        `${Config.resources.emojis.time.code} ${moment.duration(client.uptime).asHours().toFixed()}h ${moment
          .utc(client.uptime)
          .format('m')}m ${moment.utc(client.uptime).format('s')}s`,
        true
      )
      .addField('Round time ping', `${Config.resources.emojis.roundTripPing.code} ${roundTripPing}ms`, true)
      .addField('Discord API Ping', `${Config.resources.emojis.ping.code} ${apiPing}ms`, true)
      .addField('Discord status', `${discordStatusIcon}[${discordStatusText}](http://status.discordapp.com)`, true)
      .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

    // Send the embed to the same channel as the message
    await loadMsg.edit({ content: `${Config.resources.emojis.success.code} Done`, embed: embed });

    setTimeout(async () => {
      embed.setFooter(
        `${Config.resources.emojis.stopwatch.icon} Message generated in ${loadMsg.createdAt - message.createdAt}ms`
      );
      await loadMsg.edit({ embed: embed });
    }, 250);

    // handled
    return true;
  }

  // not handled
  return false;
};
