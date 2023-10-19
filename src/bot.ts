import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { chunk } from "lodash";
import express from "express";

console.log("Token: ", process.env.TELEGRAM_TOKEN);

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

// Handle the /yo command to greet the user
bot.command("yo", (ctx) => ctx.reply(`Yo ${ctx.from?.username}`));

bot.command("start", (ctx) => ctx.reply("Wussup 2"));
bot.on("message", async (ctx) => {
  console.log(ctx.message.text);
  const parts =
    ctx?.message?.text?.split("/").map((message) => message.trim()) || "";

  // Extract the last word from the first part and the first word from the last part
  const firstPartWords = parts[0].split(" ");
  const lastPartWords = parts[parts.length - 1].split(" ");

  // Take the last word from the first part and the first word from the last part
  const firstWord = firstPartWords.pop() || "Wussup";
  const lastWord = lastPartWords.shift() || "Wussup";

  const text = `${firstPartWords.join(" ").trim()} _____ ${lastPartWords
    .join(" ")
    .trim()}`;

  console.log(firstWord, lastWord, parts[1]);

  await ctx.reply(text, {
    reply_markup: new InlineKeyboard()
      .text(firstWord, "set 1")
      .text(parts[1], "set 2")
      .text(lastWord, "set 3"),
  });
});

bot.callbackQuery("set 1", async (ctx) => {
  await ctx.answerCallbackQuery({});

  const chat_id = ctx?.msg?.chat.id || 5798889325;
  const text = ctx?.callbackQuery?.message?.text || "Sorry";

  ctx.api.sendPoll(
    chat_id,
    text,
    [
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][0]?.text ||
        "OOPS",
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][1]?.text ||
        "OOPS",
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][2]?.text ||
        "OOPS",
    ],
    {
      is_anonymous: true,
      type: "quiz",
      correct_option_id: 0,
    }
  );
});

bot.callbackQuery("set 2", async (ctx) => {
  await ctx.answerCallbackQuery({});

  const chat_id = ctx?.msg?.chat.id || 5798889325;
  const text = ctx?.callbackQuery?.message?.text || "Sorry";

  ctx.api.sendPoll(
    chat_id,
    text,
    [
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][0]?.text ||
        "OOPS",
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][1]?.text ||
        "OOPS",
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][2]?.text ||
        "OOPS",
    ],
    {
      is_anonymous: true,
      type: "quiz",
      correct_option_id: 1,
    }
  );
});

bot.callbackQuery("set 3", async (ctx) => {
  await ctx.answerCallbackQuery({});

  const chat_id = ctx?.msg?.chat.id || 5798889325;
  const text = ctx?.callbackQuery?.message?.text || "Sorry";

  ctx.api.sendPoll(
    chat_id,
    text,
    [
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][0]?.text ||
        "OOPS",
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][1]?.text ||
        "OOPS",
      ctx?.callbackQuery?.message?.reply_markup?.inline_keyboard[0][2]?.text ||
        "OOPS",
    ],
    {
      is_anonymous: true,
      type: "quiz",
      correct_option_id: 2,
    }
  );
});

// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
