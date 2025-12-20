export const JOKES = [
    "Why dont skeletons fight each other? They dont have the guts.",
    "How does The Rock pee? He Dwayne's his Johnson",
    "Why dont scientists trust atoms? Because they make up everything.",
    "What do you call an Indian electrician? Ashock.",
    "Why did the bicycle fall over? It was two-tired.",
    "I told my wife she should embrace her mistakes. She gave me a hug.",
    "What do you call cheese that isnt yours? Nacho cheese.",
    "Why cant your nose be 12 inches long? Because then it would be a foot.",
    "How do you organize a space party? You planet.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "Why do cows have hooves instead of feet? Because they lactose.",
    "Why are elevator jokes so good? They work on so many levels.",
    "Why dont eggs tell jokes? Theyd crack each other up.",
    "Why cant you give Elsa a balloon? Because shell let it go.",
    "What do you call a bear with no teeth? A gummy bear."
];

export const AUTHORIZED_KICK_USERS = ['rythm', 'ihadi', 'dantehz'];

export const PLAYER_OPTIONS = {
    ytdlOptions: {
        quality: 'highestaudio' as const,
        highWaterMark: 1 << 25
    },
    skipFFmpeg: false,
    useLegacyFFmpeg: true
};

export const QUEUE_OPTIONS = {
    selfDeaf: false,
    volume: 100,
    leaveOnEmpty: false,
    leaveOnEnd: false,
    leaveOnStop: false,
    bufferingTimeout: 15000,
    connectionTimeout: undefined,
};

