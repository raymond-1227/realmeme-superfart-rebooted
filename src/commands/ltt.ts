import {
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { LTT_INTRO_PATH } from "../config/data.js";
import type { SlashCommand } from "../types/bot.js";

const fakeNames = [
  "L-Inus Te-ch Ti-ps",
  "L-Inus Te-Ch Ti-Ps",
  "L-Inus Tech Tips",
  "Linux Tech Tips",
  "Linus Tech Tips",
  "linus etch tips",
  "Linux Tech Tips",
  "Linus Etch Tips",
] as const;

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ltt")
    .setDescription(
      "This command is sponsored by *insert sponsorship name here*.",
    )
    .addStringOption((option) =>
      option.setName("sponsor").setDescription("Name your sponsor."),
    ),
  async execute(interaction) {
    const sponsor = interaction.options.getString("sponsor") ?? "nobody";
    const userVC = interaction.member.voice.channel;
    const randomfakeName =
      fakeNames[Math.floor(Math.random() * fakeNames.length)] ??
      "Linus Tech Tips";

    if (!userVC) {
      await interaction.reply({
        embeds: [
          {
            color: 0xffc916,
            title: randomfakeName,
            description: `SPONSORED BY ${sponsor}`,
            footer: {
              text: "Tip: Join a voice channel to listen to the intro music as well!",
            },
          },
        ],
      });
      return;
    }

    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: randomfakeName,
          description: `SPONSORED BY ${sponsor}`,
        },
      ],
    });

    const connection = joinVoiceChannel({
      channelId: userVC.id,
      guildId: userVC.guild.id,
      adapterCreator: userVC.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(LTT_INTRO_PATH, {
      metadata: {
        title: "lttintrolol",
      },
    });

    player.play(resource);
    connection.subscribe(player);

    const destroyConnection = (): void => {
      if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
        connection.destroy();
      }
    };

    player.on(AudioPlayerStatus.Idle, destroyConnection);
    player.on("error", (error) => {
      console.error("Audio player error in /ltt:", error);
      destroyConnection();
    });
  },
};

export default command;
