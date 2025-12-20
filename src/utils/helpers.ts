import path from 'path';
import { Message, MessageCreateOptions, MessagePayload } from 'discord.js';

export function getGifPath(gifName: string): string {
    return path.join(__dirname, '..', '..', 'assets', 'gifs', `${gifName}.gif`);
}

export function generateSize(): { size: string; rating: string } {
    const length = Math.floor(Math.random() * 20) + 1;
    const equalSigns = '='.repeat(length);

    let rating: string;
    if (length <= 5) {
        rating = "😢 Outrageous work. How are your women satisfied?";
    } else if (length <= 10) {
        rating = "😊 Very nice.";
    } else if (length <= 15) {
        rating = "😳 Oh my goodness. What a slinger!";
    } else {
        rating = "🐎";
    }

    return {
        size: `8${equalSigns}D`,
        rating
    };
}

export function getFullTitle(message: Message): string {
    const userName = message.member?.displayName || message.author.username;
    const title = userName.toLowerCase() === 'iang' ? 'Ms' : 'Mr';
    return `${title}. ${userName}`;
}

// Type-safe channel send helper
export async function send(message: Message, content: string | MessagePayload | MessageCreateOptions): Promise<void> {
    try {
        if (message.channel.isSendable()) {
            await message.channel.send(content);
        } else {
            console.error('Channel is not sendable');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

export async function sendGif(message: Message, gifName: string): Promise<void> {
    try {
        await send(message, { files: [getGifPath(gifName)] });
    } catch (error) {
        console.error('Error sending GIF:', error);
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
