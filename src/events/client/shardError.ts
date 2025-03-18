import {EventData} from "../../interfaces/eventData";
import {Events} from "discord.js";
import {logError} from "../../handlers/logHandler";

export const eventData: EventData = {
    name: Events.ShardError,
    once: false,
    run: function (error: Error): void {
        logError(`A websocket connection encountered an error: ${error}`);
    }
}