import {
    Client,
    GatewayIntentBits
} from 'discord.js';
import dotenv from 'dotenv';

console.log('starting bot...');

dotenv.config();

if (!process.env.DISCORD_TOKEN) {
    console.error('no token found in .env file!');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log('Jarvis is online! 🤖');
});

client.on('messageCreate', async message => {
    if (message.author.bot) {
        return;
    }

    const userName = message.member?.displayName || message.author.username;

    const title = userName.toLowerCase() === 'iang' ? 'Ms' : 'Mr';
    const fullTitle = `${title}. ${userName}`;

    if (message.content.toLowerCase().includes('jarvis')) {
        const command = message.content.toLowerCase()
            .replace('jarvis', '')
            .trim();

        switch (true) {
            case command.includes('hello') || command === '':
                await message.reply(`Hello ${fullTitle}`);
                break;

            case command.includes('size') || command.includes('penis'):
                const result = generateSize();
                await message.reply(`${result.size}\n${result.rating}`);
                break;
        }
    }
})

function generateSize(): { size: string, rating: string } {
    const length = Math.floor(Math.random() * 20) + 1;
    const equalSigns = '='.repeat(length);

    let rating: string;
    if (length <= 5) {
        rating = "😢 Outrageous work Master. How are your women satisfied?";
    } else if (length <= 10) {
        rating = "😊 Very nice Master.";
    } else if (length <= 15) {
        rating = "😳 Oh my goodness. What a slinger!"
    } else {
        rating = "🐎";
    }

    return {
        size: `8${equalSigns}D`,
        rating
    };
}

client.login(process.env.DISCORD_TOKEN);