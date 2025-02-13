import {EventData} from "../../interfaces/eventData";
import {Events, Message} from "discord.js";
import config from "../../resources/config.json"

export const eventData: EventData = {

    name: Events.MessageCreate,
    once: false,
    execute(message: Message) {
        if (!message.content.toLowerCase().includes('keks') || config.keksImages.length < 1) return;

        void message.reply(config.keksImages[Math.floor(Math.random() * config.keksImages.length)]);
    }
}