import type { MessageHandler } from "../types/bot.js";

const reactions = {
  moo: "🐮",
  woof: "🐶",
  meow: "🐱",
} as const;

type ReactionKey = keyof typeof reactions;

function isReactionKey(key: string): key is ReactionKey {
  return Object.hasOwn(reactions, key);
}

const handler: MessageHandler = {
  match(message) {
    return isReactionKey(message.content.trim().toLowerCase());
  },

  async execute(message) {
    const keyword = message.content.trim().toLowerCase();
    if (!isReactionKey(keyword)) return;

    await message.react(reactions[keyword]);
  },
};

export default handler;
