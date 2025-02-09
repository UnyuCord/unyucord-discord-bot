import {EventData} from "../../interfaces/eventData";
import {Events} from "discord.js";
import {botClient} from "../../index";
import {AnsiEscapeColors} from "../../resources/ansiEscapeColors";


export const eventData: EventData = {

    name: Events.ClientReady,
    once: true,
    execute(): void {

        if (botClient.client.user) {
            botClient.client.user.setActivity('Hi! I am BongBong Lobotomy Corporation!!!');
            botClient.client.user.setStatus('dnd');
            console.info(AnsiEscapeColors.Green + 'Client ready!' + AnsiEscapeColors.Reset);
        }

    }
}