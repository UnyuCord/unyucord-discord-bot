import { readdirSync } from "fs";
import * as path from "path";
import { botClient } from "../index";
import { EventData } from "src/interfaces/eventData";

export function registerEvents() {

    console.info('Reading events...');

    const eventFolders = readdirSync(path.join(__dirname, '../events'));

    eventFolders.forEach(eventFolder => {

        console.info(`Reading events in folder ${eventFolder}`);

        const eventFiles = readdirSync(path.join(__dirname, `../events/${eventFolder}`));
        eventFiles.forEach(async (fileName) => {

            console.info(`Reading event ${fileName}...`);

            const { eventData } = await import(path.join(__dirname, `../events/${eventFolder}/${fileName}`)) as { eventData: EventData };

            if (eventData.once) {
                botClient.client.once(eventData.name, (...args) => {
                    eventData.execute(...args);
                });
            } else {
                botClient.client.on(eventData.name, (...args) => {
                    eventData.execute(...args);
                });
            }
        });
        console.info(`Finished reading folder ${eventFolder}!`);
    });

    console.info('Finished reading events!');
}
