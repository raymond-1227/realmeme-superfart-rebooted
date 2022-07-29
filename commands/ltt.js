const { SlashCommandBuilder } = require("discord.js");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ltt")
    .setDescription(
      "This command is sponsored by *insert sponsorship name here*."
    ),
  async execute(interaction) {
    let userVC = interaction.member.voice.channel;
    var fakeNames = [
      "L-Inus Te-ch Ti-ps",
      "L-Inus Te-Ch Ti-Ps",
      "L-Inus Tech Tips",
      "Linux Tech Tips",
      "Linus Tech Tips",
      "linus etch tips",
      "Linux Tech Tips",
      "Linus Etch Tips",
    ];
    var randomfakeName =
      fakeNames[Math.floor(Math.random() * fakeNames.length)];

    if (!userVC)
      return interaction.reply({
        embeds: [
          {
            color: 0xffc916,
            title: randomfakeName,
            description: "SPONSORED BY *insert sponsorship name here*",
            footer: {
              text: "Tip: Join a voice channel to listen to the intro music as well!",
            },
          },
        ],
      });

    interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: randomfakeName,
          description: "SPONSORED BY *insert sponsorship name here*",
        },
      ],
    });

    const connection = joinVoiceChannel({
      channelId: userVC.id,
      guildId: userVC.guild.id,
      adapterCreator: userVC.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource("./misc/lttintro.mp3", {
      metadata: {
        title: "lttintrolol",
      },
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  },
};
