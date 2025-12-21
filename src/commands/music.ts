import { Message, VoiceBasedChannel } from 'discord.js';
import { getFullTitle, send } from '../utils/helpers';
import {
    ytSearch,
    getStreamUrl,
    players,
    connections,
    queues,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus
} from '../index';

async function playNext(guildId: string, textChannel: any) {
    const queue = queues.get(guildId);
    const player = players.get(guildId);
    
    if (!queue || queue.length === 0 || !player) {
        return;
    }

    const track = queue[0];
    
    try {
        const streamUrl = await getStreamUrl(track.url);
        if (!streamUrl) {
            textChannel?.send(`❌ Couldn't get stream for: ${track.title}`);
            queue.shift();
            playNext(guildId, textChannel);
            return;
        }

        const resource = createAudioResource(streamUrl);
        player.play(resource);
        textChannel?.send(`🎵 Now playing: **${track.title}**`);
        
    } catch (error) {
        console.error('Playback error:', error);
        textChannel?.send(`❌ Error playing: ${track.title}`);
        queue.shift();
        playNext(guildId, textChannel);
    }
}

export async function handlePlay(message: Message, command: string, _distube: any): Promise<void> {
    const fullTitle = getFullTitle(message);

    if (!message.member?.voice.channel) {
        await send(message, `${fullTitle}, you need to be in a voice channel!`);
        return;
    }

    if (!message.guild) {
        await send(message, `${fullTitle}, this command can only be used in a server!`);
        return;
    }

    const args = command.split(' ');
    let query = args.slice(1).join(' ');

    if (!query) {
        await send(message, `${fullTitle}, please specify what you'd like me to play!`);
        return;
    }

    // Support "song by artist" format
    let searchDisplay = query;
    let searchQuery = query;
    
    if (query.toLowerCase().includes(' by ')) {
        const [songPart, artistPart] = query.split(/\s+by\s+/i);
        searchQuery = `${artistPart.trim()} ${songPart.trim()}`;
        searchDisplay = `**${songPart.trim()}** by **${artistPart.trim()}**`;
    } else {
        searchDisplay = `**${query}**`;
    }

    try {
        // Search for the track
        const result = query.startsWith('http') 
            ? { url: query, title: query }
            : await ytSearch(searchQuery);
            
        if (!result) {
            await send(message, `${fullTitle}, no results found!`);
            return;
        }

        const guildId = message.guild.id;
        
        // Get or create queue
        if (!queues.has(guildId)) {
            queues.set(guildId, []);
        }
        const queue = queues.get(guildId)!;
        
        // Add to queue
        queue.push(result);
        
        // If not connected, join and set up player
        if (!connections.has(guildId)) {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: guildId,
                adapterCreator: message.guild.voiceAdapterCreator as any
            });
            
            connections.set(guildId, connection);
            
            const player = createAudioPlayer();
            players.set(guildId, player);
            
            connection.subscribe(player);
            
            // Handle track ending
            player.on(AudioPlayerStatus.Idle, () => {
                const q = queues.get(guildId);
                if (q && q.length > 0) {
                    q.shift(); // Remove finished track
                    if (q.length > 0) {
                        playNext(guildId, message.channel);
                    } else {
                        send(message, '🎵 Queue finished!');
                    }
                }
            });
            
            player.on('error', (error) => {
                console.error('Player error:', error);
                send(message, `❌ Playback error!`);
            });
            
            // Wait for connection
            try {
                await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            } catch (error) {
                connection.destroy();
                connections.delete(guildId);
                await send(message, `${fullTitle}, couldn't connect to voice channel!`);
                return;
            }
        }

        // If this is the only track, start playing
        if (queue.length === 1) {
            playNext(guildId, message.channel);
        } else {
            await send(message, `✅ Added to queue: **${result.title}** (Position: ${queue.length})`);
        }
        
    } catch (error: any) {
        console.error('Play error:', error);
        await send(message, `Sorry ${fullTitle}, something went wrong!`);
    }
}

export async function handlePause(message: Message, _distube: any): Promise<void> {
    const fullTitle = getFullTitle(message);
    if (!message.guild) return;

    const player = players.get(message.guild.id);
    if (player) {
        player.pause();
        await send(message, `⏸️ Paused the music, ${fullTitle}`);
    } else {
        await send(message, `${fullTitle}, there's no music playing!`);
    }
}

export async function handleResume(message: Message, _distube: any): Promise<void> {
    const fullTitle = getFullTitle(message);
    if (!message.guild) return;

    const player = players.get(message.guild.id);
    if (player) {
        player.unpause();
        await send(message, `▶️ Resumed the music, ${fullTitle}`);
    } else {
        await send(message, `${fullTitle}, there's no music to resume!`);
    }
}

export async function handleStop(message: Message, _distube: any): Promise<void> {
    const fullTitle = getFullTitle(message);
    if (!message.guild) return;

    const guildId = message.guild.id;
    const connection = connections.get(guildId);
    const player = players.get(guildId);
    
    if (connection) {
        connection.destroy();
        connections.delete(guildId);
    }
    if (player) {
        player.stop();
        players.delete(guildId);
    }
    queues.delete(guildId);
    
    await send(message, `⏹️ Stopped the music and cleared queue, ${fullTitle}`);
}

export async function handleSkip(message: Message, _distube: any): Promise<void> {
    const fullTitle = getFullTitle(message);
    if (!message.guild) return;

    const guildId = message.guild.id;
    const player = players.get(guildId);
    const queue = queues.get(guildId);
    
    if (player && queue && queue.length > 0) {
        player.stop(); // This triggers the Idle event which plays next
        await send(message, `⏭️ Skipped, ${fullTitle}`);
    } else {
        await send(message, `${fullTitle}, there's nothing to skip!`);
    }
}

export async function handleQueue(message: Message, _distube: any): Promise<void> {
    const fullTitle = getFullTitle(message);
    if (!message.guild) return;

    const queue = queues.get(message.guild.id);
    
    if (!queue || queue.length === 0) {
        await send(message, `${fullTitle}, the queue is empty!`);
        return;
    }

    const current = queue[0];
    const upcoming = queue.slice(1, 11);
    
    let text = `🎵 **Now Playing:** ${current.title}\n\n`;
    
    if (upcoming.length > 0) {
        text += `📜 **Up Next:**\n`;
        text += upcoming.map((t, i) => `${i + 1}. ${t.title}`).join('\n');
        
        if (queue.length > 11) {
            text += `\n\n...and ${queue.length - 11} more`;
        }
    }
    
    await send(message, text);
}
