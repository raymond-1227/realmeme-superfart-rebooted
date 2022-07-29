module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("Ready!");
    console.log(
      `The bot is currently serving ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
    );
    setInterval(() => {
      const statuses = [
        { name: "for idiots", type: "WATCHING" },
        { name: "with bricked devices", type: "PLAYING" },
        { name: "you brick phones", type: "WATCHING" },
        { name: "for new ROMs", type: "WATCHING" },
        { name: "for sir plz sir", type: "WATCHING" },
        { name: "with my pp", type: "PLAYING" },
        { name: "people not follow the guide", type: "WATCHING" },
        { name: "people double ping", type: "WATCHING" },
        { name: "with the bEsT rOm", type: "PLAYING" },
        { name: "for bugfixes", type: "WATCHING" },
      ];
      var randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity(randomStatus);
    }, 3600000);
  },
};
