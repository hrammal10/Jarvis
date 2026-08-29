import { Message } from 'discord.js';

// Command handlers
import { handleHello, handleEmpty } from './greetings';
import { handleSize, handleJoke, handleFlip, handleRoll, handleHug, handleClap, handleInsult, handleLove } from './fun';
import { handlePlay, handlePause, handleResume, handleStop, handleSkip, handleQueue } from './music';
import { handleKick } from './moderation';
import { handleHelp } from './help';
import { getFullTitle, send } from '../utils/helpers';

export async function handleCommand(message: Message, command: string, _unused: any): Promise<void> {
    // Empty command - just "jarvis"
    if (command === '') {
        return handleEmpty(message);
    }

    const commandName = command.split(' ')[0].replace(/[^a-z0-9]/gi, '');

    if (commandName === 'play') {
        return handlePlay(message, command, null);
    }

    if (commandName === 'pause') {
        return handlePause(message, null);
    }

    if (commandName === 'resume') {
        return handleResume(message, null);
    }

    if (commandName === 'stop') {
        return handleStop(message, null);
    }

    if (commandName === 'skip') {
        return handleSkip(message, null);
    }

    if (commandName === 'queue') {
        return handleQueue(message, null);
    }

    if (['hello', 'hey', 'yo', 'hi'].includes(commandName)) {
        return handleHello(message);
    }

    // Fun commands
    if (commandName === 'size' || command.includes('penis')) {
        return handleSize(message);
    }

    if (commandName === 'joke') {
        return handleJoke(message);
    }

    if (commandName === 'flip' || commandName === 'coin') {
        return handleFlip(message, command);
    }

    if (commandName === 'roll') {
        return handleRoll(message, command);
    }

    if (commandName === 'hug') {
        return handleHug(message);
    }

    if (commandName === 'clap') {
        return handleClap(message);
    }

    if (commandName === 'insult') {
        return handleInsult(message);
    }

    if (commandName === 'love') {
        return handleLove(message);
    }

    // Moderation
    if (commandName === 'kick') {
        return handleKick(message, command);
    }

    // Help
    if (commandName === 'help') {
        return handleHelp(message);
    }

    const fullTitle = getFullTitle(message);
    await send(message, `${fullTitle}, I don't know that one. Try "jarvis help".`);
}
