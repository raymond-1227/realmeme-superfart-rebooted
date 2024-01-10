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
                value: "This bot only works in the server, not in DMs!",
              },
            ],
          },
        ],
      });
    }

    // Auto Moo Responder

    if (message.content.trim().toLowerCase() === "moo") {
      message.react('🐮');
    }

    // Credits to @dumpydev for this (this is a joke btw, but the code does actually work)
    // realme Spell Check Blamer Pro+ Ultra Master Edition

    // if (
    //   (message.content.includes("realmeUI") == false &&
    //     message.content.toLowerCase().includes("realmeui")) == true
    // ) {
    //   var split = message.content.toLowerCase().split(" ");
    //   var match = split.filter((element) => element.includes("realmeui"));
    //   var index = split.indexOf(match[0]);
    // } else if (
    //   (message.content.includes("realme") == false &&
    //     message.content.toLowerCase().includes("realme")) == true
    // ) {
    //   var split = message.content.toLowerCase().split(" ");
    //   var match = split.filter((element) => element.includes("realme"));
    //   var index = split.indexOf(match[0]);
    // }
  },
};
