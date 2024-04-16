import {Client, Collection, Events, GatewayIntentBits} from "discord.js";
import config from "../config.json";
import {SlashCommand} from "../interfaces/slashCommand";
import {getSlashCommands} from "../handlers/commandHandler";
import {DiscordEvent} from "../interfaces/discordEvent";
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
    events: Collection<string, DiscordEvent> = new Collection<string, DiscordEvent>()

    async start() {

        console.info('Starting bot...')
        await getSlashCommands().then(slashCommands => this.slashCommands = slashCommands);
        registerEvents()

        this.client.login(config.token)
    }
}