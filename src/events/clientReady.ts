import { ActivityType, Events } from "discord.js";
import { defineEvent } from "../types/bot.js";

const statuses: ReadonlyArray<{ type: ActivityType; text: string }> = [
  { type: ActivityType.Custom, text: "playing with my pp" },
  { type: ActivityType.Custom, text: "playing with the bEsT rOm" },
  { type: ActivityType.Custom, text: "playing uno reverse cards" },
  { type: ActivityType.Custom, text: "playing with bricked devices" },
  { type: ActivityType.Custom, text: "listening to stopify" },
  { type: ActivityType.Custom, text: "listening to revanced yt music" },
  { type: ActivityType.Custom, text: "watching for idiots" },
  { type: ActivityType.Custom, text: "watching reddit memes" },
  { type: ActivityType.Custom, text: "watching for new ROMs" },
  { type: ActivityType.Custom, text: "watching for bugfixes" },
  { type: ActivityType.Custom, text: "watching for sir plz sir" },
  { type: ActivityType.Custom, text: "watching you brick phones" },
  { type: ActivityType.Custom, text: "watching devices bricked by AI" },
  { type: ActivityType.Custom, text: "watching people double ping" },
  { type: ActivityType.Custom, text: "watching people fall for crypto scams" },
  { type: ActivityType.Custom, text: "watching people not following the guide" },
  { type: ActivityType.Custom, text: "watching dummies who follow AI blindly" },
  {
    type: ActivityType.Custom,
    text: "watching scammers redeeming some gift cards",
  },
];

export default defineEvent({
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log("Ready to serve!");

    client.user.setPresence({
      activities: [
        {
          name: "hi i just woke up",
          type: ActivityType.Custom,
        },
      ],
    });

    setInterval(() => {
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      if (!randomStatus) return;

      client.user.setPresence({
        activities: [
          {
            name: randomStatus.text,
            type: randomStatus.type,
          },
        ],
      });

      console.log("Status changed!");
    }, 1_800_000);
  },
});
