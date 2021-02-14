const Permissions = require('../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'lmgtfy',
  usage: 'lmgtfy <query>',
  aliases: [],
  name: 'LMGTFY',
  description: 'Generates a LMGTFY link',
  permissionsNeeded: Permissions.User,
};

const Config = require('../../Config');
const DoesMessageMatchCommand = require('../../Utils/DoesMessageMatchCommand');

module.exports.handler = async function Diagnostics(message, client, data) {
  const content = message.content.toLowerCase();

  if (!DoesMessageMatchCommand(message, module.exports.commandInfo)) return false;

  const arg = content.substr(`${Config.commandPrefix}lmgtfy `.length);

  if (arg === '') {
    const failReply = await message.channel.send(
      `${Config.resources.emojis.fail.code} You need to provide a valid search query.\nExample: \`${Config.commandPrefix}lmgtfy realme reddit\``
    );

    try {
      await message.delete();
    } catch {}

    setTimeout(async () => {
      await failReply.delete();
    }, 1000 * 15);

    return true;
  }

  message.reply(`<https://lmgtfy.com/?q=${encodeURI(arg)}&ovr=1>`);

  // handled
  return true;
};
