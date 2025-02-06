import {Client, Collection, GatewayIntentBits} from "discord.js";
import config from "../resources/config.json";
import {SlashCommand} from "../interfaces/slashCommand";
import {getSlashCommands} from "../handlers/commandHandler";
import {registerEvents} from "../handlers/eventHandler";
import {Mongoose} from "mongoose";
import {AnsiEscapeColors} from "../resources/ansiEscapeColors";

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
            .catch(error => console.error(AnsiEscapeColors.RedBg + error + AnsiEscapeColors.Reset));

        console.info('Connecting to db...');
         await this.db.connect(config.mongoUri)
            .then(() =>  {
                this.connectedToDb = true;
                console.log(AnsiEscapeColors.Green + 'Connected to db!' + AnsiEscapeColors.Reset)
            })
            .catch(error => console.error(AnsiEscapeColors.RedBg + `Could not connect to db: ${error}` + AnsiEscapeColors.Reset));

        console.info(`Logging into Discord client...`);
        await this.client.login(config.token);
    }
}
