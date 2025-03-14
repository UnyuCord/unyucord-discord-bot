import {Client, Collection, GatewayIntentBits} from "discord.js";
import config from "../resources/config.json";
import {SlashCommand} from "../interfaces/slashCommand";
import {getSlashCommands} from "../handlers/commandHandler";
import {registerEvents} from "../handlers/eventHandler";
import {Mongoose} from "mongoose";
import {logError, logInfo, logSuccess} from "../handlers/logHandler";
import Innertube from "youtubei.js";

export default class BotClient {

    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates
        ]
    });

    // CommandName, SlashCommand
    slashCommands: Collection<string, SlashCommand> = new Collection<string, SlashCommand>();
    //TODO: Decide if db and innertube should be put in their respective handlers
    db: Mongoose = new Mongoose();
    innertube!: Innertube;
    //TODO: Add events for db disconnects to set this flag to false and vice versa
    connectedToDb = false;

    async start() {

        logInfo('Starting bot...');

        registerEvents();

        await getSlashCommands()
            .then(slashCommands => this.slashCommands = slashCommands)
            .catch(error => logError(error));

        this.innertube = await Innertube.create();

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
