import { Events } from "discord.js";
import { defineEvent, type MessageHandler } from "../types/bot.js";

export default defineEvent({
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const handlers = [...message.client.messages.values()];
    const matchingHandlers: MessageHandler[] = [];

    for (const handler of handlers) {
      try {
        if (handler.match(message)) {
          matchingHandlers.push(handler);
        }
      } catch (error) {
        console.error("[MESSAGE] Match error:", error);
      }
    }

    const exclusiveHandlers = matchingHandlers.filter(
      (handler) => handler.exclusive,
    );

    const selectedHandlers = exclusiveHandlers.length
      ? exclusiveHandlers
      : matchingHandlers;

    const results = await Promise.allSettled(
      selectedHandlers.map((handler) => handler.execute(message)),
    );

    for (const [index, result] of results.entries()) {
      if (result.status === "rejected") {
        console.error(
          "[MESSAGE] Handler failed:",
          selectedHandlers[index],
          result.reason,
        );
      }
    }
  },
});
