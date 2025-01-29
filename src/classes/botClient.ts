import {Client, Collection, GatewayIntentBits} from "discord.js";
import config from "../resources/config.json";
import {SlashCommand} from "../interfaces/slashCommand";
import {getSlashCommands} from "../handlers/commandHandler";
import {registerEvents} from "../handlers/eventHandler";
import {Mongoose} from "mongoose";

export default class BotClient {

    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    slashCommands: Collection<string, SlashCommand> = new Collection<string, SlashCommand>();
    db: Mongoose = new Mongoose();
    connectedToDb = false;

    async start() {

        console.info('Starting bot...');

        registerEvents();

        await getSlashCommands()
            .then(slashCommands => this.slashCommands = slashCommands)
            .catch(error => console.error(error));

        console.info('Connecting to db...');
         await this.db.connect(config.mongoUri)
            .then(() =>  {
                this.connectedToDb = true;
                console.log('Connected to db!')
            })
            .catch(error => console.error(`Could not connect to db: ${error}`));

        console.info(`Logging into Discord client...`);
        await this.client.login(config.token);
    }
}
