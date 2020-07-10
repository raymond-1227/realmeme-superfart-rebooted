const Config = require('../Config');
const Log = require('../Utils/Log');

const AllowedUsers = [Config.resources.userIds.mrjeeves, Config.resources.userIds.gamr13];

const { SetRandomStatus } = require('../RichPresence/setUpRichPresence');

module.exports = async function Diagnostics(message, client) {
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

    Log.Helpers.CommandRun(message, 'changestatus');

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
