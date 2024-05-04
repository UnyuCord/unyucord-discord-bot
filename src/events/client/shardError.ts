import {DiscordEvent} from "../../interfaces/discordEvent";
import {Events} from "discord.js";

export const eventData: DiscordEvent = {
    name: Events.ShardError,
    once: false,
    execute: function (error: Error): void {
        console.error('A websocket connection encountered an error:', error);
    }
}