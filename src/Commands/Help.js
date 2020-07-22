const Permissions = require('../data/Permissions');
module.exports.commandInfo = {
  trigger: 'help',
  usage: 'help',
  aliases: ['commands'],
  name: 'Help',
  description: 'Lists all commands',
  permissionsNeeded: Permissions.User,
};

const Config = require('../Config');
const { MessageEmbed } = require('discord.js');

const AdminUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

module.exports.handler = async function Help(message, client, data) {
  const content = message.content.toLowerCase();

  if (content.startsWith(`${Config.commandPrefix}help`) || content.startsWith(`${Config.commandPrefix}commands`)) {
    const { allCommands: AllCommands } = data;
    let CommandData = [];

    /*
      * Example command data

      cleanup: {
        trigger: 'cleanup',
        usage: 'cleanup',
        aliases: [],
        name: 'Clean up',
        description: 'Removes all messages from the bot from the last 5 mins (max 50 msgs)',
        permissionsNeeded: 4
      },
    */

    AllCommands.forEach((command) => {
      const { commandInfo } = command;
      CommandData.push(commandInfo);
    });

    // sort by commands
    CommandData.sort((a, b) => (a.trigger > b.trigger ? 1 : -1));

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('realmeme SuperFART Commands')
      // Set the color of the embed
      .setColor(Config.colors.primary)
      // Set the main content of the embed
      .setDescription(
        "Here's all the commands supported by the realmeme SuperFART bot.\nIn usage, square brackets mean an argument is optional, and angled brackets mean it's required."
      )
      //.setURL()
      .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

    const UserCommands = CommandData.filter((cd) => cd.permissionsNeeded === Permissions.User);
    UserCommands.forEach((thisCommand) => {
      let info = '';

      info += `*${thisCommand.description}*`;
      info += `\n**Usage:** \`${Config.commandPrefix}${thisCommand.usage}\``;

      embed.addField(`${thisCommand.name} | ${Config.commandPrefix}${thisCommand.trigger}`, info, false);
    });

    const adminEmbed = new MessageEmbed()
      // Set the title of the field
      .setTitle('Admin commands')
      // Set the color of the embed
      .setColor(Config.colors.primary)
      // Set the main content of the embed
      .setDescription("You're an admin, so you get some special commands too!")
      //.setURL()
      .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

    const AdminCommands = CommandData.filter((cd) => cd.permissionsNeeded === Permissions.Admin);
    AdminCommands.forEach((thisCommand) => {
      let info = '';

      info += `*${thisCommand.description}*`;
      info += `\n**Usage:** \`${Config.commandPrefix}${thisCommand.usage}\``;

      adminEmbed.addField(`${thisCommand.name} | ${Config.commandPrefix}${thisCommand.trigger}`, info, false);
    });

    await message.author.send(embed);
    if (AdminUsers.includes(message.author.id)) await message.author.send(adminEmbed);

    const reply = await message.channel.send(
      new MessageEmbed()
        .setTitle('📬 List of commands sent!')
        .setDescription(`Check your DMs, <@${message.author.id}>`)
        .setFooter('This message will auto-delete after 10 seconds')
        .setColor(Config.colors.primary)
    );

    setTimeout(async () => {
      await reply.delete();
      try {
        await message.delete();
      } catch {}
    }, 1000 * 10);

    // handled
    return true;
  }

  // not handled
  return false;
};
