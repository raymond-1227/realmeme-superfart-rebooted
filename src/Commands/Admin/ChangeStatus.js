const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'changestatus',
  usage: 'changestatus',
  aliases: [],
  name: 'Change status',
  description: 'Forces the bot to pick a new status',
  permissionsNeeded: Permissions.Admin,
};

const Config = require('../../Config');
const Log = require('../../Utils/Log');

const AllowedUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

const { SetRandomStatus } = require('../../RichPresence/setUpRichPresence');
const DoesMessageMatchCommand = require('../../Utils/DoesMessageMatchCommand');

module.exports.handler = async function Diagnostics(message, client, data) {
  if (!DoesMessageMatchCommand(message, module.exports.commandInfo)) return false;

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
};
