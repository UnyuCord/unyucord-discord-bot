import { EventData } from "../../interfaces/eventData";
import { botClient } from "../../index";

export const eventData: EventData = {
    name: 'open',
    once: false,
    async execute() {
        botClient.connectedToDb = true;
        console.log('Connected to db!');
    }
}
