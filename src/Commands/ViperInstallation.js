const Permissions = require('../data/Permissions');
module.exports.commandInfo = {
  trigger: 'viper',
  usage: 'viper [@mention(s)]',
  aliases: [],
  name: 'ViPER',
  description: 'Instructions for how to install ViPER4Android',
  permissionsNeeded: [Permissions.User],
};

const Config = require('../Config');
const { MessageEmbed } = require('discord.js');
const Log = require('../Utils/Log');

module.exports.handler = async function ViperInstallation(message, client, data) {
  const content = message.content.toLowerCase();

  if (content.startsWith(`${Config.commandPrefix}viper`)) {
    const reply = await message.reply(`${Config.resources.emojis.loading.code} ${Config.resources.strings.loading}`);

    let viperInfo = null;
    try {
      viperInfo = require('../../files/ViPER/versions.json');
    } catch (err) {
      Log('Error fetching ViPER info', Log.SEVERITY.WARN);
      reply.edit(`${Config.resources.emojis.fail.code} An error ocurred. <@${Config.resources.userIds.mrjeeves}>`);
      return true;
    }

    const viperLatest = viperInfo.versions.latest;

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`ViPER Audio FX ${viperLatest.versionNumber}`)
      // Set the color of the embed
      .setColor(Config.colors.primary)
      .setThumbnail(viperLatest.image)
      // Set the main content of the embed
      .setDescription(
        "The audio on the X2 Pro is pretty terrible without using some audio effects app, and that's what ViPER is for."
      )
      .setURL(viperInfo.officialUrl)
      .addFields([
        {
          name: 'Installation',
          value:
            '**1.** Download the attached file and install it\n' +
            '**2.** Launch the app and grant superuser permission\n' +
            '**3.** Run the `adb` command below\n' +
            '**4.** Go into ViPER settings and toggle the two options at the top off and on again',
        },
        {
          name: 'Troubleshooting',
          value:
            'Because of how custom ROMs add their own FX apps, they can sometimes interfere with ViPER. Run the command below to uninstall these:\n' +
            '```adb shell "pm uninstall -k --user 0 com.android.musicfx; pm uninstall -k --user 0 com.dolby.dax2appUI"```',
        },
        {
          name: 'Download',
          value: `[Download ViPER4Android ${viperLatest.versionNumber}](${viperLatest.downloadURL})`,
        },
      ])
      .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

    let pings = '';

    if (message.mentions.members.length > 0) {
      pings = 'Hey ';

      Array.from(message.mentions.members.keys()).forEach((userId) => {
        pings += `<@${userId}> `;
      });
    }

    // Send the embed to the same channel as the message
    await reply.edit({
      content: `${Config.resources.emojis.success.code} Done! ${pings}`,
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
  }

  // not handled
  return false;
};
