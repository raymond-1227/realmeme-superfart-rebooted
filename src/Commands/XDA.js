const Permissions = require('../data/Permissions');
module.exports.commandInfo = {
  trigger: 'xda',
  usage: 'xda <device name>',
  aliases: [],
  name: 'XDA',
  description: 'Gets the XDA link for the specified device',
  permissionsNeeded: Permissions.User,
};

const Config = require('../Config');

const Fuse = require('fuse.js');
const { MessageEmbed, MessageAttachment } = require('discord.js');

const options = {
  includeScore: true,
  minMatchCharLength: 1,
  keys: [
    { name: 'shortName', weight: 1.5 },
    { name: 'fullName', weight: 1.5 },
    { name: 'deviceCodes', weight: 0.85 },
  ],
};

module.exports.handler = async function XDA(message, client, data) {
  const content = message.content.toLowerCase();

  if (content.startsWith(`${Config.commandPrefix}xda`)) {
    const args = content.substr(`${Config.commandPrefix}xda`.length);

    // Source: https://realmeupdater.com/supported/
    const xdaUrls = require('../data/DeviceXDAList');

    const fuse = new Fuse(xdaUrls, options);

    const xdaResult = await fuse.search(args)[0];

    if (typeof xdaResult === 'undefined') {
      await message.channel.send(
        `${Config.resources.emojis.fail.code} Couldn't find specified realme device on XDA <@${message.author.id}>\n\nTry seaching by its device codename (e.g. RMX1931)`
      );
      return true;
    }

    const xdaLogoAttachment = new MessageAttachment('img/xda_logo.png', 'xda_logo.png');

    const embed = new MessageEmbed()
      .attachFiles(xdaLogoAttachment)
      .setThumbnail('attachment://xda_logo.png')
      // Set the title of the field
      .setTitle(`${xdaResult.item.fullName} on XDA`)
      // Set the color of the embed
      .setColor(Config.colors.primary)
      .setURL(xdaResult.item.url)
      .setDescription(
        `View the official XDA Forums for your device, containing custom ROMs, kernels, guides, and more.`
      )
      .addField('Known codenames', xdaResult.item.deviceCodes.join(', '))
      .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

    // Send the embed to the same channel as the message
    const reply = await message.channel.send({
      content: ``,
      embed: embed,
    });

    setTimeout(async () => {
      embed.setFooter(
        `${Config.resources.emojis.stopwatch.icon} Message generated in ${
          reply.createdAt - message.createdAt
        }ms (Search score: ${Math.round(xdaResult.score * 10000) / 10000})`
      );
      await reply.edit({ embed: embed });
    }, 250);

    // handled
    return true;
  }

  // not handled
  return false;
};
