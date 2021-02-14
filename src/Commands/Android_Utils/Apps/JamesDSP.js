const Permissions = require('../../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'jamesdsp',
  usage: 'jamesdsp [@mention(s)]',
  aliases: [],
  name: 'JamesDSP',
  description: 'Instructions for how to install JamesDSP',
  permissionsNeeded: Permissions.User,
};

const Config = require('../../../Config');
const { MessageEmbed } = require('discord.js');
const Log = require('../../../Utils/Log');
const GetPings = require('../../../Utils/GetPings');
const DoesMessageMatchCommand = require('../../../Utils/DoesMessageMatchCommand');

module.exports.handler = async function JamesDspInstallation(message, client, data) {
  if (!DoesMessageMatchCommand(message, module.exports.commandInfo)) return false;

  const reply = await message.reply(`${Config.resources.emojis.loading.code} ${Config.resources.strings.loading}`);

  let dspInfo = null;

  try {
    dspInfo = require('../../../../files/JamesDSP/versions.json');
  } catch (err) {
    Log('Error fetching JamesDSP info', Log.SEVERITY.WARN);
    reply.edit(`${Config.resources.emojis.fail.code} An error ocurred. <@${Config.resources.userIds.mrjeeves}>`);
    return true;
  }

  const latestDsp = dspInfo.versions.latest;

  const embed = new MessageEmbed()
    .setTitle(`JamesDSP ${viperLatest.versionNumber}`)
    .setColor(Config.colors.primary)
    .setThumbnail(viperLatest.image)
    .setDescription('JamesDSP is a (much better) alternative to ViPER4Android.')
    .setURL(viperInfo.officialUrl)
    .addFields([
      {
        name: 'Installation',
        value:
          '**1.** Download the attached file and install it in Magisk\n' +
          '**2.** Launch the app and grant superuser permission if asked\n' +
          '**2.** Play around with it as you wish.',
      },
      {
        name: 'Download',
        value: `[Download JamesDSP ${latestDsp.versionNumber}](${latestDsp.downloadURL})`,
      },
    ])
    .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

  const pingText = GetPings(message);

  // Send the embed to the same channel as the message
  await reply.edit({
    content: `${Config.resources.emojis.success.code} Done! ${pingText}`,
    embed: embed,
  });

  setTimeout(async () => {
    embed.setFooter(
      `${Config.resources.emojis.stopwatch.icon} Message generated in ${reply.createdAt - message.createdAt}ms`
    );
    await reply.edit({ embed: embed });
  }, 250);

  // handled
  return true;
};
