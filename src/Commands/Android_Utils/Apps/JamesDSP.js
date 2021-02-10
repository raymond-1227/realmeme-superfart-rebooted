const Permissions = require('../../../data/Permissions');
module.exports.commandInfo = {
  trigger: 'jamesdsp',
  usage: 'jamesdsp [@mention(s)]',
  aliases: [],
  name: 'JamesDSP',
  description: 'Instructions for how to install JamesDSP',
  permissionsNeeded: Permissions.User,
};

const Config = require('../../../Config');
const { MessageEmbed } = require('discord.js');
const Log = require('../../../Utils/Log');

module.exports.handler = async function ViperInstallation(message, client, data) {
  const content = message.content.toLowerCase();
  
  if (content.startsWith(`${Config.commandPrefix}jamesdsp`)) {
    const reply = await message.reply(`${Config.resources.emojis.loading.code} ${Config.resources.strings.loading}`);
  
  let dspInfo = null;
    try {
      dspInfo = require('../../../../files/JamesDSP/versions.json');
    } catch (err) {
      Log('Error fetching JamesDSP info', Log.SEVERITY.WARN);
      reply.edit(`${Config.resources.emojis.fail.code} An error ocurred. <@${Config.resources.userIds.mrjeeves}>`);
      return true;
    }
  
	const dspInfo = dspInfo.versions.latest;
	
	const embed = new MessageEmbed()
	.setTitle(`JamesDSP ${viperLatest.versionNumber}`)
  
}