import {DiscordEvent} from "../../interfaces/discordEvent";
import {Client, Events} from "discord.js";
import BotClient from "../../classes/botClient";


export class ReadyEvent implements DiscordEvent {

    name = Events.ClientReady;
    once = true;
    execute(botClient: BotClient): void {

        console.log('Client ready!');
        if (botClient.client.user) {
            botClient.client.user.setActivity('Watching for git activity... and commands ig...');
            botClient.client.user.setStatus('dnd');
        }

    }
}