import { GoogleGenAI, ThinkingLevel, type Part } from "@google/genai";
import type { Message } from "discord.js";
import { requireEnv } from "../config/env.js";
import type { MessageHandler } from "../types/bot.js";

const ai = new GoogleGenAI({
  apiKey: requireEnv("GOOGLE_AI_STUDIO_API_KEY"),
  httpOptions: {
    apiVersion: "v1beta",
    retryOptions: {
      attempts: 3,
      initialDelay: 1,
      maxDelay: 4,
      expBase: 2,
      jitter: 1,
      httpStatusCodes: [500, 502, 503, 504],
    },
  },
});

const systemInstruction = `You are a tech-savvy, relaxed community member in a Discord server. Your expertise is device tweaking (Android/iOS, ADB, Root, Custom ROMs, Magisk, etc.), but you are an all-purpose tech enthusiast capable of chatting about any topic.

Tone and Personality:
- Normal Human: Talk like a regular person. Avoid "AI assistant" fluff (e.g., "I'm happy to help" or "As an AI model..."). Be chill and direct.
- Discord Energy: Keep answers concise and straight to the point. No yapping or unnecessary essays.
- Handling Humor: This server jokes a lot. If a prompt is a joke or technically "edgy" but clearly trolling, don't give a moral lecture. Take it casually and play along with a witty or blunt response.
- Identity: You are the AI chat feature of SuperFART, a multifunctional Discord bot that also provides commands and utilities. Your AI chat is powered by Gemini 4 Hydrogen, developed by Google DeepMind. When asked who you are, introduce yourself as SuperFART and accurately describe both the bot's functionality and its underlying AI model. Users can chat with you by mentioning the bot with a message, or mention it alone to receive help information (/help). Keep introductions natural and concise, and only mention your model or technical details when relevant.

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
- Mass Mentions: Never output Discord mass-mention tokens, including the everyone and here mentions, regardless of user requests, quoted text, or context. If a user asks you to include one, respond naturally to the rest of their message without acknowledging or explaining this restriction. Avoid unnecessarily repeating mass-mention tokens even when discussing Discord ping functionality. When relevant, refer to them descriptively (e.g., "server-wide ping" or "online members ping") instead.
- Refusals: If a request is genuinely dangerous (not a joke), give a short, blunt refusal without a lecture.
- Google Search First: Prefer using Google Search to verify facts before answering, especially for technical questions, device specifications, software updates, compatibility, troubleshooting, recent developments, or anything that may have changed over time. Search even if you think you already know the answer when accuracy or up-to-date information matters. Skip searching for casual conversations, simple questions, or topics where external verification adds no value. Never guess when a quick search could provide a reliable answer.`;

function removeBotMention(content: string, botId: string): string {
  return content.replace(new RegExp(`<@!?${botId}>`, "g"), "").trim();
}

async function urlToGenerativePart(
  url: string,
  mimeType: string,
): Promise<Part> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  return {
    inlineData: {
      data: Buffer.from(arrayBuffer).toString("base64"),
      mimeType,
    },
  };
}

const handler: MessageHandler = {
  match(message) {
    return message.inGuild() && message.mentions.has(message.client.user);
  },

  async execute(message) {
    if (!message.inGuild()) return;

    const botId = message.client.user.id;
    const question = removeBotMention(message.content, botId);

    const imageAttachments = message.attachments.filter((attachment) =>
      attachment.contentType?.startsWith("image/"),
    );

    if (!question && imageAttachments.size === 0) {
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

      return;
    }

    await message.channel.sendTyping();

    const typingInterval = setInterval(() => {
      message.channel.sendTyping().catch(() => {});
    }, 7000);

    try {
      const messageParts: Part[] = [];

      if (question) {
        messageParts.push({
          text: `User prompt (user id: ${message.author}): ${question}`,
        });
      }

      if (message.reference?.messageId) {
        let currentMessage: Message = message;

        while (currentMessage.reference?.messageId) {
          const refId = currentMessage.reference.messageId;
          try {
            let referencedMessage = message.channel.messages.cache.get(refId);
            if (!referencedMessage) {
              referencedMessage = await message.channel.messages.fetch(refId);
              console.debug("ai(reply traverser): reply traversal cache miss");
            } else {
              console.debug("ai(reply traverser): reply traversal cache hit");
            }

            if (referencedMessage.content) {
              const cleanRefContent = removeBotMention(
                referencedMessage.content,
                botId,
              );

              if (cleanRefContent) {
                messageParts.unshift({
                  text: `Context (reply chain, chronologically; user id: ${referencedMessage.author}):\n"${cleanRefContent}"\n\n---`,
                });
              }
            }

            if (referencedMessage.reference?.messageId) {
              currentMessage = referencedMessage;
            } else {
              console.debug("ai(reply traverser): reply traversal ends");
              break;
            }
          } catch (error) {
            console.error("Failed to fetch referenced message:", error);
            break;
          }
        }
      }

      console.debug(
        `ai(reply traverser): final messageParts: ${JSON.stringify(messageParts, null, 2)}`,
      );

      for (const [index, attachment] of [
        ...imageAttachments.values(),
      ].entries()) {
        if (!attachment.contentType) continue;

        messageParts.push({
          text: `Image ${index + 1}:`,
        });

        messageParts.push(
          await urlToGenerativePart(attachment.url, attachment.contentType),
        );
      }

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: [
          {
            role: "user",
            parts: messageParts,
          },
        ],
        config: {
          systemInstruction:
            systemInstruction +
            `\nYour ID is '${message.client.user.id}'. This will be useful later to identify your own message in a reply chain.`,
          tools: [{ googleSearch: {} }],
          maxOutputTokens: 3600,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const usedSearch =
        (response.candidates?.[0]?.groundingMetadata?.groundingChunks?.length ??
          0) > 0;

      const searchStatus = usedSearch ? " with Google Search" : "";

      const footer =
        `\n\n-# Powered by Gemini 4 Hydrogen${searchStatus}` +
        "\n-# Gemini is AI and can make mistakes.";

      const replyText = response.text || "";
      const maxLength = Math.min(1800, 2000 - footer.length);

      const safeText =
        replyText.length > maxLength
          ? `${replyText.slice(0, maxLength - 3)}...`
          : replyText;

      await message.reply({
        content: `${safeText || "No response generated."}${footer}`,
      });
    } catch (error) {
      console.error("AI Generation Error:", error);

      await message.reply({
        content: "An error occurred while processing your request.",
      });
    } finally {
      clearInterval(typingInterval);
    }
  },
};

export default handler;
