import { Message } from 'discord.js';
import { send } from '../utils/helpers';

const HELP_TEXT = `**Jarvis Commands:**
\`jarvis hello\` - Greet Jarvis
\`jarvis help\` - Show this help message
\`jarvis play <song>\` - Play a song
\`jarvis pause\` - Pause the music
\`jarvis resume\` - Resume the music
\`jarvis skip\` - Skip the current track
\`jarvis queue\` - Show the current queue
\`jarvis stop\` - Stop the music
\`jarvis size\` - Check your size
\`jarvis flip <heads/tails>\` - Flip a coin
\`jarvis roll [sides]\` - Roll a die
\`jarvis joke\` - Tell a joke
\`jarvis hug\` - Get a hug
\`jarvis clap\` - Get applause
\`jarvis kick <username> <server/call>\` - Kick a user`;

export async function handleHelp(message: Message): Promise<void> {
    await send(message, HELP_TEXT);
}
