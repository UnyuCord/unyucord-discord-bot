import { Client, Collection, GatewayIntentBits } from "discord.js";
import config from "../resources/config.json";
import { SlashCommand } from "../interfaces/slashCommand";
import { getSlashCommands } from "../handlers/commandHandler";
import { registerEvents } from "../handlers/eventHandler";
import { dbClient, registerDbEvents } from "../db/dbHandler";

export default class BotClient {

    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    slashCommands: Collection<string, SlashCommand> = new Collection<string, SlashCommand>();
    connectedToDb = false;

    async start() {

        console.info('Starting bot...');

        registerEvents();
        registerDbEvents()

        await getSlashCommands()
            .then(slashCommands => this.slashCommands = slashCommands)
            .catch(error => console.error(error));

        console.info('Connecting to db...');
        await dbClient.connect();

        console.info(this.connectedToDb);
        console.info(`Logging into Discord client...`);
        await this.client.login(config.token);
    }
}
