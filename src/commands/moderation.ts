import { Message } from 'discord.js';
import { getFullTitle, sendGif, sleep, send } from '../utils/helpers';
import { AUTHORIZED_KICK_USERS } from '../config/constants';

export async function handleKick(message: Message, command: string): Promise<void> {
    const fullTitle = getFullTitle(message);

    await send(message, 'On it.');
    await sleep(500);
    await sendGif(message, 'processing');
    await sleep(800);

    const isServerKick = command.includes('server');
    const isCallKick = command.includes('call') || command.includes('voice');

    const words = command.split(' ');
    const kickIndex = words.findIndex(word => word === 'kick');
    const targetName = kickIndex !== -1 ? words[kickIndex + 1] : '';

    if (!targetName) {
        await send(message, `Please specify who to kick, ${fullTitle}`);
        return;
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
        await send(message, `I couldn't find anyone named "${targetName}", ${fullTitle}.`);
        return;
    }

    if (isServerKick) {
        if (!AUTHORIZED_KICK_USERS.includes(message.member?.displayName.toLowerCase() || '')) {
            await send(message, `${fullTitle}, you are not authorized to kick members from the server.`);
            return;
        }

        try {
            await member.kick('Kicked by Jarvis');
            await send(message, `Kicked ${member.displayName} from the server, ${fullTitle}.`);
        } catch (error) {
            console.error('Kick error:', error);
            await send(message, `I apologize ${fullTitle}, I don't have permission to remove ${member.displayName}.`);
        }
        return;
    }

    if (isCallKick) {
        if (member.voice.channel) {
            try {
                await member.voice.disconnect();
                await send(message, `Kicked ${member.displayName} from the call, ${fullTitle}.`);
            } catch (error) {
                await send(message, `I apologize ${fullTitle}, I don't have permission to remove ${member.displayName} from the call.`);
            }
        } else {
            await send(message, `${member.displayName} is not in a voice channel, ${fullTitle}.`);
        }
        return;
    }

    await send(message, `Please specify whether to kick from 'server' or 'call', ${fullTitle}.`);
}
