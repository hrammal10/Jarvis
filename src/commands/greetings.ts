import { Message } from 'discord.js';
import { getFullTitle, send } from '../utils/helpers';

export async function handleHello(message: Message): Promise<void> {
    const fullTitle = getFullTitle(message);
    await send(message, `Hello ${fullTitle}`);
}

export async function handleEmpty(message: Message): Promise<void> {
    const fullTitle = getFullTitle(message);
    await send(message, `Yes ${fullTitle}`);
}
