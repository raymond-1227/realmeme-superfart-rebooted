/**
 *
 * @param {import('discord.js').Message} message
 */
module.exports = function GetPings(message) {
  /**
   * @type {import('discord.js').User[]}
   */
  const uniquePings = message.mentions.users.reduce((arr, user) => {
    if (!arr.includes(user)) {
      return [...arr, user];
    }

    return arr;
  }, []);

  console.log(uniquePings);

  if (uniquePings.length === 0) return '';

  let pingText = 'Hey ';

  uniquePings.forEach((user, i) => {
    if (i === uniquePings.length - 1 && i > 0) pingText += ' and ';
    else if (i > 0) pingText += ', ';

    pingText += `<@${user.id}>`;
  });

  console.log(pingText);

  return pingText;
};
