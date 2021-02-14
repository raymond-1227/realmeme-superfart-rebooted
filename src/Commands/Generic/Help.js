const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'help',
  usage: 'help',
  aliases: ['commands'],
  name: 'Help',
  description: 'Lists all commands',
  permissionsNeeded: Permissions.User,
};

const Config = require('../../Config');
const { MessageEmbed } = require('discord.js');
const DoesMessageMatchCommand = require('../../Utils/DoesMessageMatchCommand');

const AdminUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

module.exports.handler = async function Help(message, client, data) {
  if (!DoesMessageMatchCommand(message, module.exports.commandInfo)) return false;

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
    .setTitle('realmeme SuperFART Commands')
    .setColor(Config.colors.primary)
    .setDescription(
      "Here's all the commands supported by the realmeme SuperFART bot.\nIn usage, square brackets mean an argument is optional, and angled brackets mean it's required.\n\nThis will look nicer soon."
    )
    .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

  const UserCommands = CommandData.filter((cd) => cd.permissionsNeeded === Permissions.User);
  UserCommands.forEach((thisCommand) => {
    let info = '';

    info += `*${thisCommand.description}*`;
    info += `\n**Usage:** \`${Config.commandPrefix}${thisCommand.usage}\``;

    embed.addField(`${thisCommand.name} | ${Config.commandPrefix}${thisCommand.trigger}`, info, false);
  });

  const adminEmbed = new MessageEmbed()
    .setTitle('Admin commands')
    .setColor(Config.colors.primary)
    .setDescription("You're an admin, so you get some special commands too!")
    .setFooter(`${Config.resources.emojis.stopwatch.icon} Calculating...`);

  const AdminCommands = CommandData.filter((cd) => cd.permissionsNeeded === Permissions.Admin);
  AdminCommands.forEach((thisCommand) => {
    let info = '';

    info += `*${thisCommand.description}*`;
    info += `\n**Usage:** \`${Config.commandPrefix}${thisCommand.usage}\``;

    adminEmbed.addField(`${thisCommand.name} | ${Config.commandPrefix}${thisCommand.trigger}`, info, false);
  });

  const cmds = await message.author.send(embed);
  let adminCmds = undefined;
  if (AdminUsers.includes(message.author.id)) adminCmds = await message.author.send(adminEmbed);

  const reply = await message.channel.send(
    new MessageEmbed()
      .setTitle('📬 List of commands sent!')
      .setDescription(`Check your DMs, <@${message.author.id}>`)
      .setFooter('This message will auto-delete after 10 seconds')
      .setColor(Config.colors.primary)
  );

  setTimeout(async () => {
    embed.setFooter(
      `${Config.resources.emojis.stopwatch.icon} Message generated in ${cmds.createdAt - message.createdAt}ms`
    );
    adminCmds &&
      adminEmbed.setFooter(
        `${Config.resources.emojis.stopwatch.icon} Message generated in ${adminCmds.createdAt - message.createdAt}ms`
      );

    await cmds.edit({ embed: embed });
    adminCmds && (await adminCmds.edit({ embed: adminEmbed }));
  }, 250);

  setTimeout(async () => {
    await reply.delete();
    try {
      await message.delete();
    } catch {}
  }, 1000 * 10);

  // handled
  return true;
};
