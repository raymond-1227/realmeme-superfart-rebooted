const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'magisk',
  usage: 'magisk [@mention(s)]',
  aliases: ['root'],
  name: 'Magisk ZIP',
  description: 'Latest working Magisk ZIP',
  permissionsNeeded: Permissions.User,
};

const FALLBACK_VERSION = '21.4';

const Config = require('../../Config');
const { MessageEmbed } = require('discord.js');
const Log = require('../../Utils/Log');
const GetPings = require('../../Utils/GetPings');
const DoesMessageMatchCommand = require('../../Utils/DoesMessageMatchCommand');

module.exports.handler = async function Magisk(message, client, data) {
  if (!DoesMessageMatchCommand(message, module.exports.commandInfo)) return false;

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
  const fallbackMagisk = magiskInfo.versions[FALLBACK_VERSION];

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
        name: 'If you bootloop...',
        value:
          '**1.** Reboot to recovery by holding Volume up and Power to reboot\n' +
          '**2.** Install the Magisk_Uninstaller.zip file\n' +
          '**3.** Try installing the Magisk 20.3 zip file instead as the FALLBACK OPTION',
      },
      {
        name: 'Download latest',
        inline: true,
        value: `[Download Magisk ${magiskLatest.versionNumber}](${magiskLatest.downloadURL})
[Download Magisk ${magiskLatest.versionNumber} Uninstaller](${magiskLatest.downloadURLUninstaller})`,
      },
      {
        name: `Download ${fallbackMagisk.versionNumber}`,
        inline: true,
        value: `[Download Magisk ${fallbackMagisk.versionNumber}](${fallbackMagisk.downloadURL})
[Download Magisk ${fallbackMagisk.versionNumber} Uninstaller](${fallbackMagisk.downloadURLUninstaller})`,
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
