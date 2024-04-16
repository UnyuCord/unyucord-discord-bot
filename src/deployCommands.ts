import {REST, Routes} from "discord.js";
import config from "./config.json";
import {getSlashCommands} from "./handlers/commandHandler";

// TODO: God this is all ugly af please fix this future me
const rest = new REST({version: "10"}).setToken(config.token);
getSlashCommands().then(commands => {
    const commandsData = commands.map(command => command.data.toJSON());
    return deployGlobalCommands(commandsData);
});



export async function deployGuildCommands(guildId: string, commandsData: any[]) {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(config.token, guildId),
            {
                body: commandsData,
            }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

export async function deployGlobalCommands(commandsData: any[]) {
    try {
        console.log("Started refreshing application (/) commands.");
        console.log(commandsData)

        await rest.put(
            Routes.applicationCommands(config.applicationId),
            {
                body: commandsData,
            }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}
