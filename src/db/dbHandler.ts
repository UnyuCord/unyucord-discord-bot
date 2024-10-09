import { readdirSync } from "fs";
import { MongoClient, ServerApiVersion } from "mongodb";
import config from "../resources/config.json"
import * as path from 'path';
import { EventData } from "src/interfaces/eventData";

export const dbClient = new MongoClient(config.mongoUri.replace('*', config.mongoPassword), {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});
export function registerDbEvents() {
    console.info('Reading db events...');

    const eventFiles = readdirSync(path.join(__dirname, 'events'));
    eventFiles.forEach(async (fileName) => {

        console.info(`Reading event ${fileName}...`);

        let { eventData } = await import(path.join(__dirname, `events/${fileName}`)) as { eventData: EventData };

        if (eventData.once) {
            dbClient.once(eventData.name, (...args) => {
                eventData.execute(...args);
            });
        } else {
            dbClient.on(eventData.name, (...args) => {
                eventData.execute(...args);
            });
        }
    });

    console.info('Finished reading db events!');
}
