import { Client, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { SpotifyExtractor } from '@discord-player/extractor';
import dotenv from 'dotenv';
import 'ffmpeg-static';

import { handleCommand } from './commands';
import { PLAYER_OPTIONS } from './config/constants';

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

// Initialize music player
const player = new Player(client, PLAYER_OPTIONS);

// Player event listeners
player.events.on('error', (queue, error) => {
    console.error('Player error:', error);
});

player.events.on('playerError', (queue, error) => {
    console.error('Player audio error:', error);
});

player.events.on('playerStart', (queue, track) => {
    console.log('Started playing:', track.title);
});

player.events.on('audioTrackAdd', (queue, track) => {
    console.log('Track added to queue:', track.title);
});

player.events.on('connection', (queue) => {
    console.log('Connected to voice channel');
});

player.events.on('disconnect', (queue) => {
    console.log('Disconnected from voice channel');
});

player.events.on('debug', (queue, message) => {
    console.log('Player debug:', message);
});

// Bot ready event
client.once('ready', async () => {
    console.log('Jarvis is online! 🤖');
    
    // Load extractors
    try {
        // Load default extractors but skip Spotify (we'll configure it separately)
        await player.extractors.loadDefault((ext) => ext !== 'SpotifyExtractor');
        
        // Register Spotify with credentials
        if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
            await player.extractors.register(SpotifyExtractor, {
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET
            });
            console.log('Spotify extractor configured with credentials');
        } else {
            console.warn('Warning: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not set in .env');
            // Load Spotify without credentials (limited functionality)
            await player.extractors.register(SpotifyExtractor, {});
        }
        
        console.log('Extractors loaded:', player.extractors.store.map(e => e.identifier).join(', '));
    } catch (error) {
        console.error('Failed to load extractors:', error);
    }
});

// Message handler
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes('jarvis')) {
        const command = message.content.toLowerCase()
            .replace('jarvis', '')
            .trim();

        await handleCommand(message, command, player);
    }
});

// Login with error handling
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('Failed to login to Discord:', error);
        process.exit(1);
    });
