import {DiscordEvent} from "../../interfaces/discordEvent";
import {Events, Message} from "discord.js";
import config from "../../resources/config.json"

export const eventData: DiscordEvent = {

    name: Events.MessageCreate,
    once: false,
    execute(message: Message) {
        if (!message.content.toLowerCase().includes('keks')) return;

        message.reply(config.keksImages[Math.floor(Math.random() * config.keksImages.length)]);
    }
}