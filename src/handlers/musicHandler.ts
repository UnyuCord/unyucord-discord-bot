import {Collection, Snowflake} from "discord.js";
import {AudioPlayer} from "@discordjs/voice";
import {SongEntry} from "../classes/songEntry";

// GuildId, SongEntry
export const guildQueues: Collection<Snowflake, SongEntry[]> = new Collection<Snowflake, SongEntry[]>();
// GuildId, AudioPlayer
export const audioPlayers: Collection<Snowflake, AudioPlayer> = new Collection<Snowflake, AudioPlayer>();
// GuildId, Timeout
export const idleTimeOut: Collection<Snowflake, NodeJS.Timeout> = new Collection<Snowflake, NodeJS.Timeout>();

export function addToQueue(guildId: Snowflake, songEntry: SongEntry) {
    if (!guildQueues.has(guildId)) {
        guildQueues.set(guildId, [songEntry]);
    } else {
        const urlArray = guildQueues.get(guildId);
        if (urlArray) {
            urlArray.push(songEntry);
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