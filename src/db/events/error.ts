import { EventData } from "../../interfaces/eventData";

export const eventData: EventData = {
    name: 'error',
    once: false,
    execute(error: Error) {
        console.error(error);
    }
}
