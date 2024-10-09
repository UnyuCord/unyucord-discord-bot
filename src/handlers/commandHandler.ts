import { readdirSync } from 'fs'
import * as path from "path";
import { SlashCommand } from "../interfaces/slashCommand";
import { Collection } from "discord.js";

export async function getSlashCommands(): Promise<Collection<string, SlashCommand>> {
    console.info('Reading commands...');

    const commandFiles = readdirSync(path.join(__dirname, '../commands'));
    const slashCommandCollection = new Collection<string, SlashCommand>();

    for (const fileName of commandFiles) {
        console.info(`Reading command ${fileName}...`);
        const { command } = await import(path.join(__dirname, `../commands/${fileName}`)) as { command: SlashCommand };
        slashCommandCollection.set(command.data.name, command);
    }

    console.info('Finished reading commands!');
    return slashCommandCollection;
}
