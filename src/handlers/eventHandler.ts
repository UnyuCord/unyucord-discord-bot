import {readdirSync} from "fs";
import * as path from "path";
import {botClient} from "../index";
import {EventData} from "src/interfaces/eventData";
import {logInfo, logSuccess} from "./logHandler";

export function registerEvents() {

    logInfo('Reading events...');

    const eventFolders = readdirSync(path.join(__dirname, '../events'));

    eventFolders.forEach(eventFolder => {

        logInfo(`Reading events in folder ${eventFolder}`);

        const eventFiles = readdirSync(path.join(__dirname, `../events/${eventFolder}`));
        eventFiles.forEach(async (fileName) => {

            logInfo(`Reading event ${fileName}...`);

            const { eventData } = await import(path.join(__dirname, `../events/${eventFolder}/${fileName}`)) as { eventData: EventData };

            if (eventData.once) {
                botClient.client.once(eventData.name, (...args) => {
                    eventData.run(...args);
                });
            } else {
                botClient.client.on(eventData.name, (...args) => {
                    eventData.run(...args);
                });
            }
        });
        logSuccess(`Finished reading folder ${eventFolder}!`);
    });

    logSuccess('Finished reading events!');
}
