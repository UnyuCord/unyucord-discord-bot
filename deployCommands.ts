import { REST, Routes } from "discord.js";
import config from "./src/resources/config.json";
import { getSlashCommands } from "./src/handlers/commandHandler";

// TODO: God this is all ugly af please fix this future me
const rest = new REST({ version: "10" }).setToken(config.token);
getSlashCommands().then(commands => {
    const commandsData = commands.map(command => command.data.toJSON());
    return deployGlobalCommands(commandsData);
});


async function deployGlobalCommands(commandsData: any[]) {
    try {
        console.info("Started refreshing application (/) commands.");
        console.info(commandsData)

        await rest.put(
            Routes.applicationCommands(config.applicationId),
            {
                body: commandsData,
            }
        );

        console.info("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}
