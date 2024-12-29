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

            case command.includes('kick'):
                const isServerKick = command.includes('server');
                const isCallKick = command.includes('call') || command.includes('voice');
                let targetName = '';
                const words = command.split(' ');
                const kickIndex = words.findIndex(word => word === 'kick');

                if (kickIndex !== -1) {
                    targetName = words[kickIndex + 1];
                }

                if (!targetName) {
                    await message.reply(`Please specify who to kick, ${fullTitle}`);
                    break;
                }
                try {
                    await message.guild?.members.fetch();
                } catch (error) {
                    console.error('Error fetching members:', error);
                }
                const member = message.guild?.members.cache.find(
                    m => m.displayName.toLowerCase() === targetName.toLowerCase() ||
                        m.user.username.toLowerCase() === targetName.toLowerCase()
                );

                if (!member) {
                    await message.reply(`I couldn't find anyone named "${targetName}", ${fullTitle}.`);
                    break;
                }
                if (isServerKick) {
                    const authorizedUsers = ['rythm', 'ihadi', 'dantehz'];
                    if (!authorizedUsers.includes(message.member?.displayName.toLowerCase() || '')) {
                        await message.reply(`${fullTitle}, you are not authorized to kick members from the server.`);
                        break;
                    }
                    
                    try {
                        await member.kick('Kicked by Jarvis');
                        await message.reply(`I have removed ${member.displayName} from the server, ${fullTitle}.`);
                    } catch (error) {
                        console.error('Kick error:', error);
                        await message.reply(`I apologize ${fullTitle}, I don't have permission to remove ${member.displayName}.`);
                    }
                }
                else if (isCallKick) {
                    if (member.voice.channel) {
                        try {
                            await member.voice.disconnect();
                            await message.reply(`I have removed ${member.displayName} from the call, ${fullTitle}.`);
                        } catch (error) {
                            await message.reply(`I apologize ${fullTitle}, I don't have permission to remove ${member.displayName} from the call.`);
                        }
                    } else {
                        await message.reply(`${member.displayName} is not in a voice channel, ${fullTitle}.`);
                    }
                } else {
                    await message.reply(`Please specify whether to kick from 'server' or 'call', ${fullTitle}.`);
                }
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