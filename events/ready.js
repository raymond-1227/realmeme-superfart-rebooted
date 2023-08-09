const { ActivityType } = require("discord.js");
const path = require("node:path");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {

    console.log("Ready to serve!");

    // Status Changer
    
    client.user.setPresence({
      activities: [{
        name: "hi i just woke up",
        type: ActivityType.Playing,
      }],
    })
    
    setInterval(() => {
      const statuses = [
        { type: ActivityType.Playing, text: "with my pp" },
        { type: ActivityType.Playing, text: "with the bEsT rOm" },
        { type: ActivityType.Playing, text: "uno reverse cards" },
        { type: ActivityType.Playing, text: "people double ping" },
        { type: ActivityType.Playing, text: "with bricked devices" },
        { type: ActivityType.Listening, text: "stopify" },
        { type: ActivityType.Listening, text: "yt music free" },
        { type: ActivityType.Watching, text: "for idiots" },
        { type: ActivityType.Watching, text: "reddit memes" },
        { type: ActivityType.Watching, text: "for new ROMs" },
        { type: ActivityType.Watching, text: "for bugfixes" },
        { type: ActivityType.Watching, text: "for sir plz sir" },
        { type: ActivityType.Watching, text: "you brick phones" },
        { type: ActivityType.Watching, text: "people not follow the guide" },
      ];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      client.user.setPresence({
        activities: [{
          name: randomStatus.text,
          type: randomStatus.type,
        }],
      })
      console.log("Status changed!")
    }, 1800000);
  },
};
