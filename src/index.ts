import BotClient from "./classes/botClient";
import process from "process";

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

export const botClient = new BotClient();
botClient.start();
