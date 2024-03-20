import { readdirSync } from 'fs'
import * as path from "path";
import {botClient} from "../index";

export function registerSlashCommands() {
    console.log('Reading commands...');

    const commandFiles = readdirSync('commands').filter(file => file.endsWith('.ts'));
    commandFiles.forEach(fileName => {

        console.log(`Reading command ${fileName}...`);
        import(path.join(`commands/${fileName}`)).then(slashCommand => {
            botClient.slashCommands.set(slashCommand.name, slashCommand);
        });
    });
    console.log('Finished reading commands!')
}