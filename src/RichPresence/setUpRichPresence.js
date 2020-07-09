const Log = require('../Utils/Log');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const statuses = [
  { msg: 'for idiots', type: 'WATCHING' },
  { msg: 'with bricked devices', type: 'PLAYING' },
  { msg: 'you brick phones', type: 'WATCHING' },
  { msg: 'for new ROMs', type: 'WATCHING' },
  { msg: 'for sir plz sir', type: 'WATCHING' },
  { msg: 'with my pee pee', type: 'PLAYING' },
  { msg: 'people not follow the guide', type: 'WATCHING' },
  { msg: 'people double ping', type: 'WATCHING' },
  { msg: 'with the bEsT rOm', type: 'PLAYING' },
  { msg: 'for bugfixes', type: 'WATCHING' },
];

module.exports = function SetUpRichPresence(client) {
  // Update status every 10 mins
  setInterval(() => {
    SetRandomStatus(client);
  }, 10 * 60 * 1000);
  SetRandomStatus(client);
};

function SetRandomStatus(client, force = false) {
  const i = getRandomInt(statuses.length);

  if (client.user.presence.activities.length > 0 && !force) {
    // skip next update if manually changed
    if (new Date() - Number.parseInt(client.user.presence.activities[0].url) < 14 * 60 * 1000) return false;
  }

  const statusText = `${statuses[i].type.substr(0, 1)}${statuses[i].type.substr(1).toLowerCase()} ${statuses[i].msg}`;

  client.user
    .setActivity(statuses[i].msg, {
      type: statuses[i].type,
      url: `${new Date().getTime()}`,
    })
    .then(() => {
      Log(`Changed presence: ${statusText}`, Log.SEVERITY.INFO);
    })
    .catch(() => {
      Log(`Failed to initialise rich presence`, Log.SEVERITY.ERROR);
    });

  return statusText;
}

module.exports.SetRandomStatus = SetRandomStatus;
