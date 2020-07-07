const Config = require('../Config');
const { MessageEmbed } = require('discord.js');
const Log = require('../Utils/Log');

module.exports = async function TheBestRomIsALie(message) {
  const content = message.content.toLowerCase();

  //#region Actual command

  if (content.startsWith(`${Config.commandPrefix}best rom`) || content.startsWith(`${Config.commandPrefix}bestrom`)) {
    Log.Helpers.CommandRun(message, 'best rom');

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
