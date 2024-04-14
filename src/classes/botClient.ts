import {Client, Collection, Events, GatewayIntentBits} from "discord.js";
import config from "../config.json";
import {SlashCommand} from "../interfaces/slashCommand";
import {registerSlashCommands} from "../handlers/commandHandler";
import {DiscordEvent} from "../interfaces/discordEvent";

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

    start() {

        console.log('Starting bot...')
        registerSlashCommands();



        this.client.once(Events.ClientReady, readyClient => {
            if (!this.client.user || this.client.application) return;
            console.log(`Client is ready, logged in as ${readyClient.user.tag}`);
        });

        this.client.login(config.token);
    }
}