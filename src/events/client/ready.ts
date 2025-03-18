import {EventData} from "../../interfaces/eventData";
import {Events} from "discord.js";
import {botClient} from "../../index";
import {logSuccess} from "../../handlers/logHandler";


export const eventData: EventData = {

    name: Events.ClientReady,
    once: true,
    run(): void {

        if (botClient.client.user) {
            botClient.client.user.setActivity('Hi! I am BongBong Lobotomy Corporation!!!');
            botClient.client.user.setStatus('dnd');
            logSuccess('Client ready!');
        }

    }
}