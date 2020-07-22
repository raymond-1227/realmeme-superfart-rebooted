const Permissions = require('../data/Permissions');
module.exports.commandInfo = {
  trigger: 'changestatus',
  usage: 'changestatus',
  aliases: [],
  name: 'Change status',
  description: 'Forces the bot to pick a new status',
  permissionsNeeded: Permissions.Admin,
};

const Config = require('../Config');
const Log = require('../Utils/Log');

const AllowedUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

const { SetRandomStatus } = require('../RichPresence/setUpRichPresence');

module.exports.handler = async function Diagnostics(message, client, data) {
  const content = message.content.toLowerCase();

  if (content.startsWith(`${Config.commandPrefix}changestatus`)) {
    // Unauthorised
    if (!AllowedUsers.includes(message.author.id)) {
      Log(
        `User ${message.author.username}#${message.author.discriminator} attempted to run 'changestatus' (${message.author.id})`,
        Log.SEVERITY.WARN
      );
      return true;
    }

    const newStatus = SetRandomStatus(client, true);

    message.reply(
      `${Config.resources.emojis.success.code} Updated presence (might take up to 1 min to change).\n\nNew status: ${newStatus}.`
    );

    // handled
    return true;
  }

  // not handled
  return false;
};
