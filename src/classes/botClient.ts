import {Client, Collection, GatewayIntentBits} from "discord.js";
import config from "../resources/config.json";
import {SlashCommand} from "../interfaces/slashCommand";
import {getSlashCommands} from "../handlers/commandHandler";
import {registerEvents} from "../handlers/eventHandler";

export default class BotClient {

    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    slashCommands: Collection<string, SlashCommand> = new Collection<string, SlashCommand>();

    async start() {

        console.info('Starting bot...');
        registerEvents()
        await getSlashCommands()
            .then(slashCommands => this.slashCommands = slashCommands)
            .catch(error => console.error(error));


        await this.client.login(config.token)
    }
}