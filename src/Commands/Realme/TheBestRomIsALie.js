const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'bestrom',
  usage: 'bestrom [@mention(s)]',
  aliases: ['best rom'],
  name: 'Best ROM?',
  description: 'THERE IS NO BEST ROM!',
  permissionsNeeded: Permissions.User,
};

const Log = require('../../Utils/Log');

const Config = require('../../Config');

module.exports.handler = async function TheBestRomIsALie(message, client, data) {
  const content = message.content.toLowerCase();

  //#region Actual command

  if (content.startsWith(`${Config.commandPrefix}best rom`) || content.startsWith(`${Config.commandPrefix}bestrom`)) {
    let pings = '';

    if (message.mentions.members.size > 0) {
      Array.from(message.mentions.members.keys()).forEach((userId) => {
        pings += `<@${userId}> `;
      });
    }

    // Send the embed to the same channel as the message
    if (pings) {
      await message.channel.send(
        pings +
          "__**There is no \"best ROM\"!**__ One person's favourite ROM won't be the same as someone else's favourite ROM." +
          '\n\n' +
          'The real best ROM is the one which you enjoy using the most, find the most stable, and has the features you want to use.'
      );
    } else {
      await message.channel.send(
        "__**There is no \"best ROM\".**__ One person's favourite ROM won't be the same as someone else's favourite ROM." +
          '\n\n' +
          'The real best ROM is the one which you enjoy using the most, find the most stable, and has the features you want to use.'
      );
    }

    // handled
    return true;
  }

  //#endregion Actual command

  //#region Message content trigger

  if (content.includes('best rom') && !content.includes('no ')) {
    Log.Helpers.CommandTriggered(message, 'best rom');

    await message.reply(
      "**There is no \"best ROM\".** One person's favourite ROM won't be the same as someone else's favourite ROM." +
        '\n\n' +
        'The real best ROM is the one which you enjoy using the most, find the most stable, and has the features you want to use.'
    );

    // handled
    return true;
  }

  //#endregion Actual command

  // not handled
  return false;
};
