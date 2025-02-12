import {readdirSync} from 'fs'
import * as path from "path";
import {SlashCommand} from "../interfaces/slashCommand";
import {Collection} from "discord.js";
import {logInfo, logSuccess} from "./logHandler";

export async function getSlashCommands(): Promise<Collection<string, SlashCommand>> {
    logInfo('Reading commands...');

    const commandFiles = readdirSync(path.join(__dirname, '../commands'));
    const slashCommandCollection = new Collection<string, SlashCommand>();

    for (const fileName of commandFiles) {
        logInfo(`Reading command ${fileName}...`);
        const { command } = await import(path.join(__dirname, `../commands/${fileName}`)) as { command: SlashCommand };
        slashCommandCollection.set(command.data.name, command);
    }

    logSuccess('Finished reading commands!');
    return slashCommandCollection;
}
