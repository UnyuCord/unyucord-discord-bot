import BotClient from "./classes/botClient";
import process from "process";
import {logError} from "./handlers/logHandler";

process.on('unhandledRejection', error => {
    logError(`Unhandled Rejection: ${error}`);
});

export const botClient = new BotClient();
void botClient.start();
