import {DiscordEvent} from "../../interfaces/discordEvent";
import {Events} from "discord.js";
import {botClient} from "../../index";


export const eventData: DiscordEvent = {

    name: Events.ClientReady,
    once: true,
    execute(): void {

        if (botClient.client.user) {
            botClient.client.user.setActivity('Watching for git activity... and commands ig...');
            botClient.client.user.setStatus('dnd');
            console.info('Client ready!');
        }

    }
}