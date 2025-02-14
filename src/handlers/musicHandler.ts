import {Collection, Snowflake} from "discord.js";
import {AudioPlayer} from "@discordjs/voice";

// GuildId, songQueue
export const guildQueues: Collection<Snowflake, string[]> = new Collection<Snowflake, string[]>();
// GuildId, AudioPlayer
export const audioPlayers: Collection<Snowflake, AudioPlayer> = new Collection<Snowflake, AudioPlayer>();
// GuildId, Timeout
export const idleTimeOut: Collection<Snowflake, NodeJS.Timeout> = new Collection<Snowflake, NodeJS.Timeout>();

export function addToQueue(guildId: Snowflake, videoId: string) {
    if (!guildQueues.has(guildId)) {
        guildQueues.set(guildId, [videoId]);
    } else {
        const urlArray = guildQueues.get(guildId);
        if (urlArray) {
            urlArray.push(videoId);
            guildQueues.set(guildId, urlArray);
        }
    }
}

export function removeFirstFromQueue(guildId: Snowflake) {
    const urlArray = guildQueues.get(guildId);
    if (urlArray) {
        urlArray.shift();
        guildQueues.set(guildId, urlArray);
    }
}