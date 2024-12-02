import { Telegraf } from 'telegraf';
import { client } from './binanceClient';

const BOT_TOKEN = process.env.BOT_TOKEN || '';;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(`Welcome`);
});

bot.command('withdraw', async (ctx) => {
    await ctx.reply('Coin you want transfer');

    bot.on('text', async (responseCtx) => {
        const coin = responseCtx.message.text;
        try {
            const res = await client.depositAddress(coin);
            ctx.reply(`Deposit address: <pre>${res.address}</pre>`, { parse_mode: 'HTML' });
        } catch (err) {
            console.error(err);
            ctx.reply('Error occurred while retrieving the deposit address. Please try again later.');
        }
    });
});

export const startBot = async () => {
    await bot.launch();
    console.log('Bot is running!');
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
