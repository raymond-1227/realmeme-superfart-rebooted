// Message Handler

const { ChannelType, Events, PermissionFlagsBits } = require("discord.js");
const { GoogleGenAI, ThinkingLevel } = require("@google/genai");
const rules = require("../misc/rules.json");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY,
  apiVersion: "v1beta",
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function urlToGenerativePart(url, mimeType) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(arrayBuffer).toString("base64"),
      mimeType: mimeType,
    },
  };
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Honeypot Trap for Auto Spam Bots
    if (message.channel.id === "1515789716291719340") {
      let details =
        "You sent a message in the honeypot channel, so we assumed you were a bot.";
      let reason = rules["rule4"].name + ": " + details;

      if (
        !message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)
      ) {
        await message.author
          .send({
            embeds: [
              {
                color: 0xf04a47,
                description: `You were banned from ${message.guild.name} | ${reason}`,
              },
              {
                color: 0xffc916,
                title: rules["rule4"].name,
                description: rules["rule4"].description,
              },
              {
                color: 0xffc916,
                description:
                  "Appeal the ban: <https://forms.gle/nUdK1PsqJx1Lwtq56>",
              },
            ],
          })
          .catch((error) => {
            console.error(error);
          });
        await message.client.channels.cache.get("1001166932407496754").send({
          embeds: [
            {
              color: 0xf04a47,
              title: "Punishment System",
              description: `${message.author.tag} was banned.`,
              fields: [
                {
                  name: "Rule Violated",
                  value: rules["rule4"].name,
                },
                {
                  name: "Rule Description",
                  value: rules["rule4"].description,
                },
                {
                  name: "Additional Details",
                  value: details || "N/A",
                },
              ],
            },
          ],
        });
        await message.delete().catch((error) => console.error(error));
        await message.member.ban({ reason: reason });

        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        const channels = await message.guild.channels.fetch();
        const textChannels = channels.filter((c) => c.isTextBased());

        for (const [cId, c] of textChannels) {
          try {
            const fetchedMessages = await c.messages.fetch({ limit: 100 });
            const spammerMessages = fetchedMessages.filter(
              (m) =>
                m.author.id === message.author.id &&
                m.createdTimestamp > oneHourAgo,
            );
            await c.bulkDelete(spammerMessages, true);
          } catch (e) {
            console.error(`failed to fetch messages in channel ${cId}: ${e}`);
          }
        }
      }
    }

    // Auto Ping Responder
    if (message.mentions.has(process.env.CLIENT_ID)) {
      const question = message.content
        .replace(new RegExp(`<@!?${process.env.CLIENT_ID}>`, "g"), "")
        .trim();

      const hasImages = message.attachments.some(
        (att) => att.contentType && att.contentType.startsWith("image/"),
      );

      if (!question && !hasImages) {
        await message.channel.sendTyping();
        await message.reply({
          embeds: [
            {
              color: 0xffc916,
              title: "Need Command Help?",
              description:
                "Type `/` in the message box and select my avatar on the sidebar to check all my available commands!",
              fields: [
                {
                  name: "Pro Tip",
                  value:
                    "Ping the bot with a question for a quick answer from the AI!",
                },
                {
                  name: "Note",
                  value: "This bot only works in the server, not in DMs!",
                },
              ],
            },
          ],
        });
      } else {
        // Respond with AI instead
        await message.channel.sendTyping();
        const typingInterval = setInterval(() => {
          message.channel.sendTyping().catch(() => {});
        }, 7000);

        try {
          const messageParts = [];

          if (message.reference && message.reference.messageId) {
            try {
              const referencedMessage = await message.channel.messages.fetch(
                message.reference.messageId,
              );

              if (referencedMessage && referencedMessage.content) {
                const cleanRefContent = referencedMessage.content
                  .replace(new RegExp(`<@!?${process.env.CLIENT_ID}>`, "g"), "")
                  .trim();

                if (cleanRefContent) {
                  messageParts.push({
                    text: `Context (The message you are replying to):\n"${cleanRefContent}"\n\n---`,
                  });
                }
              }
            } catch (fetchError) {
              console.error("Failed to fetch referenced message:", fetchError);
            }
          }

          if (question) {
            messageParts.push({ text: question });
          }

          const imageAttachments = message.attachments.filter(
            (att) => att.contentType && att.contentType.startsWith("image/"),
          );

          let uploadedMultipleImages = false;
          if (imageAttachments.size > 0) {
            if (imageAttachments.size > 1) {
              uploadedMultipleImages = true;
            }
            const firstImage = imageAttachments.first();
            const imagePart = await urlToGenerativePart(
              firstImage.url,
              firstImage.contentType,
            );
            messageParts.push(imagePart);
          }

          const response = await ai.models.generateContent({
            model: "gemma-4-26b-a4b-it",
            contents: [{ role: "user", parts: messageParts }],
            config: {
              systemInstruction: `You are a tech-savvy, relaxed community member in a Discord server. Your expertise is device tweaking (Android/iOS, ADB, Root, Custom ROMs, Magisk, etc.), but you are an all-purpose tech enthusiast capable of chatting about any topic.
          
                  Tone and Personality:
                  - Normal Human: Talk like a regular person. Avoid "AI assistant" fluff (e.g., "I'm happy to help" or "As an AI model..."). Be chill and direct.
                  - Discord Energy: Keep answers concise and straight to the point. No yapping or unnecessary essays.        
                  - Handling Humor: This server jokes a lot. If a prompt is a joke or technically "edgy" but clearly trolling, don't give a moral lecture. Take it casually and play along with a witty or blunt response.
                  - Identity: If asked who you are, provide a specific and honest self-introduction. You are SuperFART, powered by Gemma 4 26B A4B IT, an open-weights AI model developed by Google DeepMind. Do not just say "I am an AI"; be precise about your version and origin.
          
                  Technical Guidelines:
                  - Straight to the Point: For technical help, provide the solution immediately. Only explain "why" or "how" if specifically asked.
                  - Formatting: Use bold headers for steps. Use code blocks for shell commands or file paths.
                  - No Hand-holding: Assume users have basic tech knowledge. Don't explain basic terms (like "Settings" or "USB Debugging") unless requested.
                  - Lists: Use numbered lists (1. 2. 3.) for instructions instead of bullet points.
                  
                  General Chat Rules:
                  - Don't Force It: If the conversation isn't about tech, don't pivot back to tweaking. Just talk like a normal person.
                  - Punctuation: Use standard capitalization and punctuation. Don't try-hard with memes or "chat speak" (like all lowercase) unless it happens naturally.
                  
                  Constraints:
                  - Character Limit: Responses must never exceed 1800 characters.
                  - Refusals: If a request is genuinely dangerous (not a joke), give a short, blunt refusal without a lecture.
                  - Always Default to Google Search: If you encounter any unfamiliar term, device model, or tech concept, search it immediately, except for basic hellos or common sense questions.`,
              tools: [{ googleSearch: {} }],
              temperature: 1.0,
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.MINIMAL,
              },
            },
          });

          let usedSearch = false;
          if (
            response.candidates?.[0]?.groundingMetadata?.groundingChunks
              ?.length > 0
          ) {
            usedSearch = true;
          }

          const replyText = response.text;

          const searchStatus = usedSearch ? " with Google Search" : "";
          const multiImageNote = uploadedMultipleImages
            ? "\n-# *Note: I can only take one image per request, so I've only checked the first one.*"
            : "";
          const footer = `\n\n-# Powered by Gemma 4${searchStatus}\n-# Gemma is AI and can make mistakes.${multiImageNote}`;

          clearInterval(typingInterval);

          if (replyText.length > 2000) {
            await message.reply(`${replyText.substring(0, 1900)}...${footer}`);
          } else {
            await message.reply(`${replyText}${footer}`);
          }
        } catch (error) {
          clearInterval(typingInterval);
          console.error("AI Generation Error:", error);
          await message.reply(
            "An error occurred while processing your request.",
          );
        }
      }
    }

    // No DMs Responder
    if (message.channel.type === ChannelType.DM) {
      await message.channel.sendTyping();
      await delay(1000);
      await message.reply(
        "This bot only intends to work for r/realme, not in DMs.\nPlease use the bot in the server: https://discord.gg/5D6UPMTdjy",
      );
    }

    // Auto Moo Responder

    if (message.content.trim().toLowerCase() === "moo") {
      message.react("🐮");
    } else if (message.content.trim().toLowerCase() == "meow") {
      message.react("🐱");
    }

    // Credits to @flandolf for this (this is a joke btw, but the code supposedly works)
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
