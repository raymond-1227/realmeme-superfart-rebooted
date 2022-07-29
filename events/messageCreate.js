module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.includes("<@979758930374819910>")) {
      message.reply({
        embeds: [
          {
            color: 0xffc916,
            title: "Need Command Help?",
            description:
              "Type `/` in the message box and select my avatar on the sidebar to check all my available commands!",
            fields: [
              {
                name: "Note",
                value: "This bot only works in the server, not in DM!",
              }
            ],
          },
        ],
      });
    }
  },
};