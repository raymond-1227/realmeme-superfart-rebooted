const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'magisk',
  usage: 'magisk [@mention(s)]',
  aliases: ['root'],
  name: 'Magisk ZIP',
  description: 'Latest working Magisk ZIP',
  permissionsNeeded: Permissions.User,
};

const Config = require('../../Config');
const { MessageEmbed } = require('discord.js');
const Log = require('../../Utils/Log');

module.exports.handler = async function Magisk(message, client, data) {
  const content = message.content.toLowerCase();

  if (content.startsWith(`${Config.commandPrefix}magisk`) || content.startsWith(`${Config.commandPrefix}root`)) {
    const reply = await message.reply(`${Config.resources.emojis.loading.code} ${Config.resources.strings.loading}`);

    let magiskInfo = null;
    try {
      magiskInfo = require('../../../files/Magisk/versions.json');
    } catch (err) {
      Log('Error fetching Magisk info', Log.SEVERITY.WARN);
      reply.edit(`${Config.resources.emojis.fail.code} An error ocurred. <@${Config.resources.userIds.mrjeeves}>`);
      return true;
    }

    const magiskLatest = magiskInfo.versions.latest;

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`Magisk ${magiskLatest.versionNumber}`)
      // Set the color of the embed
      .setColor(Config.colors.primary)
      .setThumbnail(magiskLatest.image)
      // Set the main content of the embed
      .setDescription(
        "Root your device with Magisk! Note that if you've just installed your ROM, you should boot to it before flashing Magisk, otherwise you might bootloop."
      )
      .setURL(magiskInfo.officialUrl)
      .addFields([
        {
          name: 'Installation',
          value:
            '**1.** Download the ZIP via the link below\n' +
            '**2.** Flash it in TWRP/OrangeFox\n' +
            '**3.** Reboot\n' +
            '**4.** Open Magisk Manager\n' +
            '**5.** Tap Settings at the top-right\n' +
            '**6.** Scroll down and enable Magisk Hide\n' +
            '**7.** Tap "Hide Magisk Manager" above Magisk Hide\n',
        },
        {
          name: 'Root detection',
          value:
            'Some apps might detect Magisk and refuse to work. Please perform these steps if that happens:\n' +
            '**1.** Open Magisk Manager\n' +
            '**2.** Tap the Shield at the bottom\n' +
            '**3.** Tap Magisk Hide\n' +
            '**4.** Tick the app(s) which detected root\n\n' +
            "You might need to clear the app's data and cache, too.",
        },
        {
          name: 'Uninstalling',
          value:
            '**1.** Download the uninstaller ZIP via the link below\n' +
            '**2.** Flash it in TWRP/OrangeFox\n' +
            '**3.** Reboot\n',
        },
        {
          name: 'Download',
          value: `[Download Magisk ${magiskLatest.versionNumber}](${magiskLatest.downloadURL})\n[Download Magisk Uninstaller](${magiskLatest.downloadURLUninstaller})`,
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
