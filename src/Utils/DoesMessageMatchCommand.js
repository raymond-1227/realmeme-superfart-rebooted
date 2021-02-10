const Config = require('../Config');

/**
 * Checks if a message matches this command's trigger/aliases
 *
 * @param {import("discord.js").Message|string} message Either the message object, or the content itself.
 * @param {{trigger: string, usage: string, aliases: string[], name: string, description: string, permissionsNeeded: import("../data/Permissions")}} commandInfo
 */
module.exports = function DoesMessageMatchCommand(message, commandInfo) {
  const triggers = [];

  if (commandInfo.trigger) {
    triggers.push(commandInfo.trigger);
  }

  // If aliases exist, add them
  if (commandInfo.aliases && Array.isArray(commandInfo.aliases)) {
    triggers.push(...commandInfo.aliases);
  }

  let messageContent = '';

  if (typeof message === 'string') messageContent = message.toLowerCase();
  else if (typeof message.content === 'string') messageContent = message.content.toLowerCase();
  else return false;

  // trim whitespace
  messageContent = messageContent.trim();

  return triggers.some((trigger) => {
    let lookFor = `${Config.commandPrefix}${trigger}`;

    return messageContent === lookFor || messageContent.startsWith(`${lookFor} `);
  });
}
