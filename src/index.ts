import {Client, Events, GatewayIntentBits} from "discord.js";
import config from "./config.json"

console.log('Starting bot...');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Client is ready, logged in as ${readyClient.user.tag}`);
});
client.login(config.token).then(val => console.log(`${val}`));
