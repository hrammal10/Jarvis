import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
    StreamType
} from '@discordjs/voice';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

import { handleCommand } from './commands';

dotenv.config();

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Store active players per guild
export const players = new Map<string, ReturnType<typeof createAudioPlayer>>();
export const connections = new Map<string, ReturnType<typeof joinVoiceChannel>>();
export const queues = new Map<string, Array<{ url: string; title: string }>>();

export async function ytSearch(query: string): Promise<{ url: string; title: string } | null> {
    return new Promise((resolve) => {
        const searchQuery = query.toLowerCase().includes('audio') ? query : `${query} audio`;
        console.log(`Searching for: ${searchQuery}`);
        
        const ytdlp = spawn('yt-dlp', [
            `ytsearch1:${searchQuery}`,
            '--get-id',
            '--get-title',
            '--no-warnings',
            '--no-playlist'
        ]);
        
        let output = '';
        let error = '';
        
        ytdlp.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        ytdlp.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        ytdlp.on('close', (code) => {
            if (code !== 0 || !output.trim()) {
                console.error('yt-dlp search error:', error);
                resolve(null);
                return;
            }
            
            const lines = output.trim().split('\n');
            if (lines.length >= 2) {
                const title = lines[0];
                const videoId = lines[1];
                console.log(`Found: ${title} (${videoId})`);
                resolve({
                    title,
                    url: `https://www.youtube.com/watch?v=${videoId}`
                });
            } else {
                resolve(null);
            }
        });
    });
}

export function getAudioStream(url: string): ReturnType<typeof spawn> {
    console.log(`Getting stream for: ${url}`);
    
    return spawn('yt-dlp', [
        url,
        '-f', 'bestaudio',
        '-o', '-',
        '--no-warnings',
        '--no-playlist'
    ], {
        stdio: ['ignore', 'pipe', 'pipe']
    });
}

export { createAudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel, entersState, VoiceConnectionStatus, StreamType };

client.once('clientReady', () => {
    console.log('Jarvis is online! 🤖');
    console.log('Using @discordjs/voice with yt-dlp');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const lowerContent = message.content.toLowerCase();
    if (lowerContent.includes('jarvis')) {
        const jarvisIndex = lowerContent.indexOf('jarvis');
        const command = (
            message.content.slice(0, jarvisIndex) + 
            message.content.slice(jarvisIndex + 6)
        ).trim().replace(/\s+/g, ' ');
        
        const parts = command.split(' ');
        const commandWord = parts[0]?.toLowerCase() || '';
        const args = parts.slice(1).join(' ');
        const processedCommand = commandWord + (args ? ' ' + args : '');

        await handleCommand(message, processedCommand, null);
    }
});

// Login
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('Failed to login to Discord:', error);
        process.exit(1);
    });
