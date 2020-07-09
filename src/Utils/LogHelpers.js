const Log = require('./Log');

function CommandRun(message, commandName, args = null) {
  Log(
    `User ${message.author.username} ran "${commandName}" in channel '#${message.channel.name}' in server '${
      message.guild.name
    }' ${args && `with arguments '${args}'`}`,
    Log.SEVERITY.VERBOSE
  );
}

function CommandTriggered(message, commandName) {
  Log(
    `User ${message.author.username} triggered "${commandName}" in channel '#${message.channel.name}' in server '${message.guild.name}'`,
    Log.SEVERITY.VERBOSE
  );
}

module.exports = { CommandRun, CommandTriggered };
