import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState
} from '@discordjs/voice';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

import { handleCommand } from './commands';

const execAsync = promisify(exec);

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
const players = new Map<string, ReturnType<typeof createAudioPlayer>>();
const connections = new Map<string, ReturnType<typeof joinVoiceChannel>>();
const queues = new Map<string, Array<{ url: string; title: string }>>();

// Helper function to search YouTube using yt-dlp (async to not block audio)
export async function ytSearch(query: string): Promise<{ url: string; title: string } | null> {
    try {
        // Add "audio" to prefer audio versions over music videos
        const searchQuery = query.toLowerCase().includes('audio') || query.toLowerCase().includes('lyrics')
            ? query
            : `${query} audio`;
            
        const { stdout } = await execAsync(
            `yt-dlp "ytsearch:${searchQuery}" --get-id --get-title --no-warnings 2>/dev/null`,
            { timeout: 20000 }
        );
        
        const lines = stdout.trim().split('\n').filter(l => l.trim());
        if (lines.length >= 2) {
            return {
                title: lines[0],
                url: `https://www.youtube.com/watch?v=${lines[1]}`
            };
        }
        return null;
    } catch (error) {
        console.error('yt-dlp search error:', error);
        return null;
    }
}

// Get audio stream URL from yt-dlp (async to not block audio)
export async function getStreamUrl(videoUrl: string): Promise<string | null> {
    try {
        const { stdout } = await execAsync(
            `yt-dlp "${videoUrl}" --get-url -f bestaudio --no-warnings 2>/dev/null`,
            { timeout: 20000 }
        );
        return stdout.trim().split('\n')[0] || null;
    } catch (error) {
        console.error('yt-dlp stream error:', error);
        return null;
    }
}

// Export for use in music commands
export { players, connections, queues, createAudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel, entersState, VoiceConnectionStatus };

// Bot ready event
client.once('ready', () => {
    console.log('Jarvis is online! 🤖');
    console.log('Using @discordjs/voice with yt-dlp');
});

// Message handler
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const lowerContent = message.content.toLowerCase();
    if (lowerContent.includes('jarvis')) {
        const jarvisIndex = lowerContent.indexOf('jarvis');
        const command = (
            message.content.slice(0, jarvisIndex) + 
            message.content.slice(jarvisIndex + 6)
        ).trim().replace(/\s+/g, ' '); // Normalize multiple spaces to single space
        
        const parts = command.split(' ');
        const commandWord = parts[0]?.toLowerCase() || '';
        const args = parts.slice(1).join(' ');
        const processedCommand = commandWord + (args ? ' ' + args : '');

        await handleCommand(message, processedCommand, null as any);
    }
});

// Login
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('Failed to login to Discord:', error);
        process.exit(1);
    });
