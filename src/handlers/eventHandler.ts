import {readdirSync} from "fs";
import * as path from "path";
import {botClient} from "../index";
import {DiscordEvent} from "../interfaces/discordEvent";

export function registerEvents() {
    console.log('Reading events...');

    const eventFiles = readdirSync('events').filter(file => file.endsWith('.ts'));
    eventFiles.forEach((fileName) => {
        console.log(`Reading command ${fileName}...`);

        import(path.join(`events/${fileName}`)).then((discordEvent: DiscordEvent) => {

            if (discordEvent.once) {
                botClient.client.once(discordEvent.name, (...args) => {
                    discordEvent.execute(...args);
                    return;
                });
            }

            botClient.client.on(discordEvent.name, (...args) => {
                discordEvent.execute(...args);
            });
        });

    });
}