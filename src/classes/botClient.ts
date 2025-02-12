import {Client, Collection, GatewayIntentBits} from "discord.js";
import config from "../resources/config.json";
import {SlashCommand} from "../interfaces/slashCommand";
import {getSlashCommands} from "../handlers/commandHandler";
import {registerEvents} from "../handlers/eventHandler";
import {Mongoose} from "mongoose";
import {logError, logInfo, logSuccess} from "../handlers/logHandler";

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

        logInfo('Starting bot...');

        registerEvents();

        await getSlashCommands()
            .then(slashCommands => this.slashCommands = slashCommands)
            .catch(error => logError(error));

        logInfo('Connecting to db...');
         await this.db.connect(config.mongoUri)
            .then(() =>  {
                this.connectedToDb = true;
                logSuccess('Connected to db!');
            })
            .catch(error => logError(`Could not connect to db: ${error}`));

        logInfo(`Logging into Discord client...`);
        await this.client.login(config.token);
    }
}
