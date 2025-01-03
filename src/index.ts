import {
    Client,
    GatewayIntentBits
} from 'discord.js';
import {
    Player,
    QueryType,
    GuildQueue,
    Track
} from 'discord-player';
import { YouTubeExtractor } from '@discord-player/extractor';
import dotenv from 'dotenv';
import path from 'path';
import 'ffmpeg-static';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    },
    skipFFmpeg: false, // Change this to false
    useLegacyFFmpeg: true 
});

player.events.on('error', (queue, error) => {
    console.error('Player error:', error);
});

player.events.on('playerStart', (queue, track) => {
    console.log('Started playing:', track.title);
});

player.extractors.register(YouTubeExtractor, {});

const jokes = [
    "Why dont skeletons fight each other? They dont have the guts.",
    "How does The Rock pee? He Dwayne's his Johnson",
    "Why dont scientists trust atoms? Because they make up everything.",
    "What do you call an Indian electrician? Ashock.",
    "Why did the bicycle fall over? It was two-tired.",
    "I told my wife she should embrace her mistakes. She gave me a hug.",
    "What do you call cheese that isnt yours? Nacho cheese.",
    "Why cant your nose be 12 inches long? Because then it would be a foot.",
    "How do you organize a space party? You planet.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "Why do cows have hooves instead of feet? Because they lactose.",
    "Why are elevator jokes so good? They work on so many levels.",
    "Why dont eggs tell jokes? Theyd crack each other up.",
    "Why cant you give Elsa a balloon? Because shell let it go.",
    "What do you call a bear with no teeth? A gummy bear."
];

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
            // new
            case ['hello', 'hey', 'yo'].some(word => command.includes(word)):
                await message.channel.send(`Hello ${fullTitle}`);
                break;

            // new
            case command == '':
                await message.channel.send(`Yes ${fullTitle}`);
                break;

            // new
            case command.includes('size') || command.includes('penis'):
                try {
                    await message.channel.send({
                        files: [getGifPath('processing')]
                    });
                } catch (error) {
                    console.error('Error sending GIF: ', error);
                }
                const result = generateSize();
                await message.channel.send(`${result.size}\n${result.rating}`);
                break;

            // new 
            case command.includes('kick'):
                await message.channel.send('On it.');
                await new Promise(resolve => setTimeout(resolve, 500));

                try {
                    await message.channel.send({
                        files: [getGifPath('processing')]
                    });
                } catch (error) {
                    console.error('Error sending GIF:', error);
                }

                await new Promise(resolve => setTimeout(resolve, 800));

                const isServerKick = command.includes('server');
                const isCallKick = command.includes('call') || command.includes('voice');
                let targetName = '';
                const words = command.split(' ');
                const kickIndex = words.findIndex(word => word === 'kick');

                if (kickIndex !== -1) {
                    targetName = words[kickIndex + 1];
                }

                if (!targetName) {
                    await message.channel.send(`Please specify who to kick, ${fullTitle}`);
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
                    await message.channel.send(`I couldn't find anyone named "${targetName}", ${fullTitle}.`);
                    break;
                }

                if (isServerKick) {
                    const authorizedUsers = ['rythm', 'ihadi', 'dantehz'];
                    if (!authorizedUsers.includes(message.member?.displayName.toLowerCase() || '')) {
                        await message.channel.send(`${fullTitle}, you are not authorized to kick members from the server.`);
                        break;
                    }

                    try {
                        await member.kick('Kicked by Jarvis');
                        await message.channel.send(`Kicked ${member.displayName} from the server, ${fullTitle}.`);
                    } catch (error) {
                        console.error('Kick error:', error);
                        await message.channel.send(`I apologize ${fullTitle}, I don't have permission to remove ${member.displayName}.`);
                    }
                }
                else if (isCallKick) {
                    if (member.voice.channel) {
                        try {
                            await member.voice.disconnect();
                            await message.channel.send(`Kicked ${member.displayName} from the call, ${fullTitle}.`);
                        } catch (error) {
                            await message.channel.send(`I apologize ${fullTitle}, I don't have permission to remove ${member.displayName} from the call.`);
                        }
                    } else {
                        await message.channel.send(`${member.displayName} is not in a voice channel, ${fullTitle}.`);
                    }
                } else {
                    await message.channel.send(`Please specify whether to kick from 'server' or 'call', ${fullTitle}.`);
                }
                break;

            // new
            case command.includes('joke'):
                const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                await message.channel.send(`Here's one: ${randomJoke}`);
                break;

            // new
            case command.includes('flip') || command.includes('coin'):
                const choice = command.toLowerCase().includes('heads') ? 'heads' : 'tails';

                await message.channel.send('🪙 Flippin the coin...');
                await new Promise(resolve => setTimeout(resolve, 1500));

                const flip = Math.random() < 0.5 ? 'heads' : 'tails';

                if (flip === choice) {
                    await message.channel.send(
                        `Coin landed on ${flip}! 🪙\n` 
                    );
                } else {
                    await message.channel.send(
                        `Coin landed on ${flip}! 🪙\n`
                    );
                }
                break;

            // new
            case command.includes('roll'):
                const sides = parseInt(command.split(' ')[2]) || 6;

                if (sides < 2) {
                    await message.channel.send(`${fullTitle}, minimum sides is 2!`);
                    break;
                }

                await message.channel.send('🎲 Rolling...');
                await new Promise(resolve => setTimeout(resolve, 1500));

                const roll = Math.floor(Math.random() * sides) + 1;
                await message.channel.send(
                    `🎲 ${fullTitle} rolled a ${roll}!`
                );
                break;

            // new
            case command.includes('hug'):
                try {
                    await message.channel.send({
                        files: [getGifPath('slideHug')]
                    });
                } catch (error) {
                    console.error('Error sending GIF: ', error);
                }
                break;
            // new 
            case command.includes('clap'):
                try {
                    await message.channel.send({
                        files: [getGifPath('clap')]
                    });
                } catch (error) {
                    console.error('Error sending GIF: ', error);
                }
                break;

            // new 
            case command.includes('insult'):
                message.channel.send(`I oppose disrespect ${fullTitle}`);
                break;

            //new
            case command.includes('love'):
                message.channel.send(`I am afraid I do not have any feelings ${fullTitle}`);
                break;

            // new 
            case command.includes('play'):
                if (!message.member?.voice.channel) {
                    await message.channel.send(`${fullTitle}, you need to be in a voice channel!`);
                    break;
                }

                if (!message.guild) {
                    await message.channel.send(`${fullTitle}, this command can only be used in a server!`);
                    break;
                }

                const args = command.split(' ');
                const songName = args.slice(1).join(' ');

                if (!songName) {
                    await message.channel.send(`${fullTitle}, please specify what you'd like me to play!`);
                    break;
                }

                try {
                    const queue = player.nodes.create(message.guild, {
                        metadata: {
                            channel: message.channel,
                            client: message.client
                        },
                        selfDeaf: false,
                        volume: 100,
                        leaveOnEmpty: false,
                        leaveOnEnd: false,
                        leaveOnStop: false,
                        bufferingTimeout: 15000,
                        connectionTimeout: undefined,
                    });

                    try {
                        if (!queue.connection) {
                            await queue.connect(message.member.voice.channel);
                        }

                        const searchResult = await player.search(songName, {
                            requestedBy: message.author
                        });

                        if (!searchResult || !searchResult.tracks.length) {
                            await message.channel.send(`${fullTitle}, no results found!`);
                            break;
                        }

                        const track = searchResult.tracks[0];
                        await queue.play(track);
                        await message.channel.send(`🎵 Added to queue: **${track.title}**`);

                    } catch (error) {
                        console.error('Playback error:', error);
                        queue.delete();
                        await message.channel.send(`Sorry ${fullTitle}, I couldn't play that track!`);
                    }

                } catch (error) {
                    console.error('Command error:', error);
                    await message.channel.send(`Sorry ${fullTitle}, something went wrong!`);

                    if (message.guild) {
                        const queue = player.nodes.get(message.guild);
                        if (queue) {
                            queue.delete();
                        }
                    }
                }
                break;

            case command.includes('pause'):
                if (message.guild) {
                    const queue = player.nodes.get(message.guild);
                    if (queue) {
                        queue.node.pause();
                        await message.channel.send(`⏸️ Paused the music, ${fullTitle}`);
                    }
                }
                break;

            case command.includes('resume'):
                if (message.guild) {
                    const queue = player.nodes.get(message.guild);
                    if (queue) {
                        queue.node.resume();
                        await message.channel.send(`▶️ Resumed the music, ${fullTitle}`);
                    }
                }
                break;

            case command.includes('stop'):
                if (message.guild) {
                    const queue = player.nodes.get(message.guild);
                    if (queue) {
                        queue.delete();
                        await message.channel.send(`⏹️ Stopped the music, ${fullTitle}`);
                    }
                }
                break;

            case command.includes('skip'):
                if (message.guild) {
                    const queue = player.nodes.get(message.guild);
                    if (queue) {
                        queue.node.skip();
                        await message.channel.send(`⏭️ Skipped the current track, ${fullTitle}`);
                    }
                }
                break;

            case command.includes('queue'):
                if (message.guild) {
                    const queue = player.nodes.get(message.guild);
                    if (!queue || !queue.tracks.size) {
                        await message.channel.send(`${fullTitle}, there are no songs in the queue!`);
                        break;
                    }

                    const tracks = queue.tracks.map((track, i) => {
                        return `${i + 1}. **${track.title}**`;
                    }).join('\n');

                    await message.channel.send(`📜 Current Queue:\n${tracks}`);
                }
                break;
            case command.includes('help'):
                await message.channel.send(
                    'jarvis hello\n' +
                    'jarvis help\n' +
                    'jarvis play <song>\n' +
                    'jarvis pause\n' +
                    'jarvis resume\n' +
                    'jarvis skip\n' +
                    'jarvis queue\n' +
                    'jarvis stop\n' +
                    'jarvis leave\n' +
                    'jarvis size \n' +
                    'jarvis flip <heads/tails>\n' +
                    'jarvis roll\n' +
                    'jarvis joke\n' +
                    'jarvis hug\n' +
                    'jarvis kick [username]'
                );
                break;
        }
    }
})

function generateSize(): { size: string, rating: string } {
    const length = Math.floor(Math.random() * 20) + 1;
    const equalSigns = '='.repeat(length);

    let rating: string;
    if (length <= 5) {
        rating = "😢 Outrageous work. How are your women satisfied?";
    } else if (length <= 10) {
        rating = "😊 Very nice.";
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

function getGifPath(gifName: string): string {
    return path.join(__dirname, '..', 'assets', 'gifs', `${gifName}.gif`);
}



client.login(process.env.DISCORD_TOKEN);