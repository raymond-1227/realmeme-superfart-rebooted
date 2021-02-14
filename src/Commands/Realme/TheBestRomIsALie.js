const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'bestrom',
  usage: 'bestrom [@mention(s)]',
  aliases: ['best rom'],
  name: 'Best ROM?',
  description: 'THERE IS NO BEST ROM!',
  permissionsNeeded: Permissions.User,
};

const MessageText = `__**There is no "best ROM".**__ One person's favourite ROM won't be the same as someone else's favourite ROM.

The real best ROM is the one which you enjoy using the most, find the most stable, and has the features you want to use.`;

const Log = require('../../Utils/Log');

const Config = require('../../Config');
const GetPings = require('../../Utils/GetPings');

module.exports.handler = async function TheBestRomIsALie(message, client, data) {
  const content = message.content.toLowerCase();

  //#region Actual command

  if (content.startsWith(`${Config.commandPrefix}best rom`) || content.startsWith(`${Config.commandPrefix}bestrom`)) {
    const pingText = GetPings(message);

    // Send the embed to the same channel as the message
    await message.channel.send((pingText ? `${pingText}\n\n` : '') + MessageText);

    // handled
    return true;
  }

  //#endregion Actual command

  //#region Message content trigger

  if (content.includes('best rom') && !content.includes('no ')) {
    Log.Helpers.CommandTriggered(message, 'best rom');

    await message.reply(MessageText);

    // handled
    return true;
  }

  //#endregion Actual command

  // not handled
  return false;
};
