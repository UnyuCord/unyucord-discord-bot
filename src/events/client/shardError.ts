import {EventData} from "../../interfaces/eventData";
import {Events} from "discord.js";

export const eventData: EventData = {
    name: Events.ShardError,
    once: false,
    execute: function (error: Error): void {
        console.error('A websocket connection encountered an error:', error);
    }
}