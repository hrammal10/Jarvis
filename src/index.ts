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
import youtubedl from 'youtube-dl-exec';

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
const players = new Map<string, ReturnType<typeof createAudioPlayer>>();
const connections = new Map<string, ReturnType<typeof joinVoiceChannel>>();
const queues = new Map<string, Array<{ url: string; title: string }>>();

// Helper function to search YouTube using youtube-dl-exec
export async function ytSearch(query: string): Promise<{ url: string; title: string } | null> {
    try {
        // Add "audio" to prefer audio versions over music videos
        const searchQuery = query.toLowerCase().includes('audio') || query.toLowerCase().includes('lyrics')
            ? query
            : `${query} audio`;
        
        const result = await youtubedl(`ytsearch:${searchQuery}`, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
        }) as any;
        
        if (result && result.id && result.title) {
            return {
                title: result.title,
                url: `https://www.youtube.com/watch?v=${result.id}`
            };
        }
        return null;
    } catch (error) {
        console.error('youtube-dl search error:', error);
        return null;
    }
}

// Get audio stream URL using youtube-dl-exec
export async function getStreamUrl(videoUrl: string): Promise<string | null> {
    try {
        const result = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
            format: 'bestaudio',
        }) as any;
        
        return result?.url || null;
    } catch (error) {
        console.error('youtube-dl stream error:', error);
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
