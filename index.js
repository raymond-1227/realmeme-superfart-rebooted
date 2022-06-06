// Core codes

const fs = require("node:fs");
const { Client, Collection } = require("discord.js");
const client = new Client({
  presence: {
    status: "online",
    afk: false,
    activities: [
      {
        name: "hello there",
        type: "PLAYING",
      }
    ],
  },
  intents: 98045,
  partials: ["CHANNEL", "MESSAGE"],
});
require("dotenv").config();

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const dmNotice = {
  color: "RANDOM",
  title: "**Why hello there.**",
  description: "**Commands are disabled** in DMs.",
};

client.on("ready", () => {
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
});

client.on("interactionCreate", async (interaction) => {
  const command = client.commands.get(interaction.commandName);
  if (!interaction.isCommand()) return;
  if (!interaction.guild) {
    interaction.reply({ embeds: [dmNotice] });
  }
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      embeds: [
        {
          color: "RANDOM",
          title: "Error Occurred",
          description:
            "There was an error while executing this command!\n`" + error + "`",
        },
      ],
      content: "",
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message) => {
  const wait = require("node:timers/promises").setTimeout;
  if (message.author.bot) return;
  if (message.channel.type == "DM") {
    await wait(500);
    await message.channel.sendTyping();
    await wait(1000);
    await message.channel.send({ embeds: [dmNotice] });
  }
  if (message.content.includes("<@979758930374819910>")) {
    message.reply({
      embeds: [
        {
          color: "RANDOM",
          title: "Need Command Help?",
          description:
            "Type `/` in the message box and select my avatar on the sidebar to check all my available commands!",
        },
      ],
    });
  }
});

client.login(process.env.DISCORD);