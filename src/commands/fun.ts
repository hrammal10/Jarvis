import { Message } from 'discord.js';
import { getFullTitle, generateSize, sendGif, sleep, send } from '../utils/helpers';
import { JOKES } from '../config/constants';

export async function handleSize(message: Message): Promise<void> {
    const fullTitle = getFullTitle(message);
    await sendGif(message, 'processing');
    const result = generateSize();
    await send(message, `${result.size}\n${result.rating}`);
}

export async function handleJoke(message: Message): Promise<void> {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    await send(message, `Here's one: ${randomJoke}`);
}

export async function handleFlip(message: Message, command: string): Promise<void> {
    const fullTitle = getFullTitle(message);
    const choice = command.toLowerCase().includes('heads') ? 'heads' : 'tails';

    await send(message, '🪙 Flippin the coin...');
    await sleep(1500);

    const flip = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = flip === choice;

    await send(message,
        `Coin landed on **${flip}**! 🪙\n` +
        (won ? `✅ You won, ${fullTitle}!` : `❌ You lost, ${fullTitle}!`)
    );
}

export async function handleRoll(message: Message, command: string): Promise<void> {
    const fullTitle = getFullTitle(message);
    const sidesArgument = command.split(' ')[1];
    const sides = sidesArgument === undefined ? 6 : Number(sidesArgument);

    if (!Number.isSafeInteger(sides)) {
        await send(message, `${fullTitle}, sides must be a whole number!`);
        return;
    }

    if (sides < 2) {
        await send(message, `${fullTitle}, minimum sides is 2!`);
        return;
    }

    await send(message, '🎲 Rolling...');
    await sleep(1500);

    const roll = Math.floor(Math.random() * sides) + 1;
    await send(message, `🎲 ${fullTitle} rolled a ${roll}!`);
}

export async function handleHug(message: Message): Promise<void> {
    await sendGif(message, 'slideHug');
}

export async function handleClap(message: Message): Promise<void> {
    await sendGif(message, 'clap');
}

export async function handleInsult(message: Message): Promise<void> {
    const fullTitle = getFullTitle(message);
    await send(message, `I oppose disrespect ${fullTitle}`);
}

export async function handleLove(message: Message): Promise<void> {
    const fullTitle = getFullTitle(message);
    await send(message, `I am afraid I do not have any feelings ${fullTitle}`);
}
