const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'cleanup',
  usage: 'cleanup',
  aliases: [],
  name: 'Clean up',
  description: 'Removes all messages from the bot from the last 5 mins (max 50 msgs)',
  permissionsNeeded: Permissions.Admin,
};

const Config = require('../../Config');
const Log = require('../../Utils/Log');

const AllowedUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

const { MessageEmbed } = require('discord.js');
const DoesMessageMatchCommand = require('../../Utils/DoesMessageMatchCommand');

module.exports.handler = async function Diagnostics(message, client, data) {
  if (!DoesMessageMatchCommand(message, module.exports.commandInfo)) return false;

  // Unauthorised
  if (!AllowedUsers.includes(message.author.id)) {
    Log(
      `User ${message.author.username}#${message.author.discriminator} attempted to run 'cleanup' (${message.author.id})`,
      Log.SEVERITY.WARN
    );

    message.channel.send(
      `${Config.resources.emojis.fail.code} You don't have permission to use this command (<@${message.author.id}>)`
    );
    return true;
  }

  const requestMadeTime = message.createdAt;

  // get messages by the bot from the past 5 mins
  const allMessages = await message.channel.messages.fetch({ limit: 50 });
  const myMessages = await allMessages.filter(
    (m) => m.author.id === client.user.id && new Date() - m.createdAt < 5 * 60 * 1000
  );

  let deletedOgMessage = false;
  try {
    await message.delete();
    deletedOgMessage = true;
  } catch {
    Log("Couldn't delete user's message. Maybe I don't have the right permissions?", Log.SEVERITY.WARN);
  }

  const completionEmbed = new MessageEmbed()
    // Set the title of the field
    .setTitle('Message cleanup')
    // Set the color of the embed
    .setColor(Config.colors.primary)
    // Set the main content of the embed
    .setDescription(
      myMessages.array().length > 0
        ? `${Config.resources.emojis.loading.code} Deleting ${myMessages.array().length} messages from the past 5 mins`
        : 'No messages to clean up'
    );

  if (!deletedOgMessage) {
    completionEmbed.addField(
      'Warning',
      "I couldn't delete the command message. Check I've got the 'Manage messages' permission."
    );
  }

  const msg = await message.channel.send({ embed: completionEmbed });

  if (myMessages.array().length > 0) {
    await message.channel.bulkDelete(myMessages, true);

    completionEmbed
      .setDescription(
        `${Config.resources.emojis.success.code} Deleted ${myMessages.array().length} messages from the past 5 mins`
      )
      .setFooter(
        `${Config.resources.emojis.stopwatch.icon} Finished in ${
          new Date() - requestMadeTime
        } ms. This message will self destruct in 30s.`
      );

    await msg.edit({ embed: completionEmbed });

    setTimeout(() => {
      msg.delete();
    }, 30 * 1000);
  }

  // handled
  return true;
};
