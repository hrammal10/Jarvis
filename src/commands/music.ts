import { Message } from 'discord.js';
import { Player } from 'discord-player';
import { getFullTitle, send } from '../utils/helpers';
import { QUEUE_OPTIONS } from '../config/constants';

export async function handlePlay(message: Message, command: string, player: Player): Promise<void> {
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
    const songName = args.slice(1).join(' ');

    if (!songName) {
        await send(message, `${fullTitle}, please specify what you'd like me to play!`);
        return;
    }

    try {
        const queue = player.nodes.create(message.guild, {
            metadata: {
                channel: message.channel,
                client: message.client
            },
            ...QUEUE_OPTIONS
        });

        try {
            if (!queue.connection) {
                await queue.connect(message.member.voice.channel);
            }

            console.log(`Searching for: "${songName}"`);
            await send(message, `🔍 Searching for: **${songName}**...`);
            
            const searchResult = await player.search(songName, {
                requestedBy: message.author
            });

            console.log('Search result:', JSON.stringify({
                hasPlaylist: searchResult?.hasPlaylist,
                tracksCount: searchResult?.tracks?.length || 0,
                source: searchResult?.tracks?.[0]?.source || 'none'
            }, null, 2));

            if (!searchResult || !searchResult.tracks.length) {
                console.log('No results - searchResult:', searchResult);
                await send(message, `${fullTitle}, no results found! Try a YouTube/Spotify/SoundCloud link instead.`);
                return;
            }

            const track = searchResult.tracks[0];
            console.log(`Playing track: ${track.title}`);
            await queue.play(track);
            await send(message, `🎵 Added to queue: **${track.title}**`);
            console.log('Message sent successfully');

        } catch (error) {
            console.error('Playback error:', error);
            queue.delete();
            await send(message, `Sorry ${fullTitle}, I couldn't play that track!`);
        }

    } catch (error) {
        console.error('Command error:', error);
        await send(message, `Sorry ${fullTitle}, something went wrong!`);

        if (message.guild) {
            const queue = player.nodes.get(message.guild);
            if (queue) {
                queue.delete();
            }
        }
    }
}

export async function handlePause(message: Message, player: Player): Promise<void> {
    const fullTitle = getFullTitle(message);

    if (!message.guild) return;

    const queue = player.nodes.get(message.guild);
    if (queue) {
        queue.node.pause();
        await send(message, `⏸️ Paused the music, ${fullTitle}`);
    } else {
        await send(message, `${fullTitle}, there's no music playing!`);
    }
}

export async function handleResume(message: Message, player: Player): Promise<void> {
    const fullTitle = getFullTitle(message);

    if (!message.guild) return;

    const queue = player.nodes.get(message.guild);
    if (queue) {
        queue.node.resume();
        await send(message, `▶️ Resumed the music, ${fullTitle}`);
    } else {
        await send(message, `${fullTitle}, there's no music to resume!`);
    }
}

export async function handleStop(message: Message, player: Player): Promise<void> {
    const fullTitle = getFullTitle(message);

    if (!message.guild) return;

    const queue = player.nodes.get(message.guild);
    if (queue) {
        queue.delete();
        await send(message, `⏹️ Stopped the music, ${fullTitle}`);
    } else {
        await send(message, `${fullTitle}, there's no music playing!`);
    }
}

export async function handleSkip(message: Message, player: Player): Promise<void> {
    const fullTitle = getFullTitle(message);

    if (!message.guild) return;

    const queue = player.nodes.get(message.guild);
    if (queue) {
        queue.node.skip();
        await send(message, `⏭️ Skipped the current track, ${fullTitle}`);
    } else {
        await send(message, `${fullTitle}, there's no music playing!`);
    }
}

export async function handleQueue(message: Message, player: Player): Promise<void> {
    const fullTitle = getFullTitle(message);

    if (!message.guild) return;

    const queue = player.nodes.get(message.guild);
    if (!queue || !queue.tracks.size) {
        await send(message, `${fullTitle}, there are no songs in the queue!`);
        return;
    }

    const tracks = queue.tracks.map((track, i) => {
        return `${i + 1}. **${track.title}**`;
    }).join('\n');

    await send(message, `📜 Current Queue:\n${tracks}`);
}
