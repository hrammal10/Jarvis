import { Message } from 'discord.js';
import { Player } from 'discord-player';

// Command handlers
import { handleHello, handleEmpty } from './greetings';
import { handleSize, handleJoke, handleFlip, handleRoll, handleHug, handleClap, handleInsult, handleLove } from './fun';
import { handlePlay, handlePause, handleResume, handleStop, handleSkip, handleQueue } from './music';
import { handleKick } from './moderation';
import { handleHelp } from './help';

export async function handleCommand(message: Message, command: string, player: Player): Promise<void> {
    // Empty command - just "jarvis"
    if (command === '') {
        return handleEmpty(message);
    }

    // Music commands (check first - URLs might contain other keywords)
    if (command.startsWith('play')) {
        return handlePlay(message, command, player);
    }

    if (command.startsWith('pause')) {
        return handlePause(message, player);
    }

    if (command.startsWith('resume')) {
        return handleResume(message, player);
    }

    if (command.startsWith('stop')) {
        return handleStop(message, player);
    }

    if (command.startsWith('skip')) {
        return handleSkip(message, player);
    }

    if (command.startsWith('queue')) {
        return handleQueue(message, player);
    }

    // Greetings (use startsWith to avoid matching URLs)
    if (['hello', 'hey', 'yo', 'hi'].some(word => command.startsWith(word))) {
        return handleHello(message);
    }

    // Fun commands
    if (command.startsWith('size') || command.includes('penis')) {
        return handleSize(message);
    }

    if (command.startsWith('joke')) {
        return handleJoke(message);
    }

    if (command.startsWith('flip') || command.startsWith('coin')) {
        return handleFlip(message, command);
    }

    if (command.startsWith('roll')) {
        return handleRoll(message, command);
    }

    if (command.startsWith('hug')) {
        return handleHug(message);
    }

    if (command.startsWith('clap')) {
        return handleClap(message);
    }

    if (command.startsWith('insult')) {
        return handleInsult(message);
    }

    if (command.startsWith('love')) {
        return handleLove(message);
    }

    // Moderation
    if (command.startsWith('kick')) {
        return handleKick(message, command);
    }

    // Help
    if (command.startsWith('help')) {
        return handleHelp(message);
    }
}
