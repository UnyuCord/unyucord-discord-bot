import {readdirSync} from 'fs'
import * as path from "path";
import {SlashCommand} from "../interfaces/slashCommand";
import {Collection} from "discord.js";
import {logInfo, logSuccess} from "./logHandler";

export async function getSlashCommands(): Promise<Collection<string, SlashCommand>> {
    logInfo('Reading commands...');

    const folders = readdirSync(path.join(__dirname, '../commands/'));
    const slashCommandCollection = new Collection<string, SlashCommand>();

    for (const folder of folders) {
        logInfo(`Reading folder ${folder}...`);
        const files = readdirSync(path.join(__dirname, `../commands/${folder}/`));
        for (const file of files) {
            logInfo(`Reading command ${file}...`);
            const { command } = await import(path.join(__dirname, `../commands/${folder}/${file}`)) as { command: SlashCommand };
            slashCommandCollection.set(command.data.name, command);
        }
        logSuccess(`Finished reading commands in ${folder}!`)
    }

    logSuccess('Finished reading commands!');
    return slashCommandCollection;
}
