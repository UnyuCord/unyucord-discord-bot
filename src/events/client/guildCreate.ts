import {DiscordEvent} from "../../interfaces/discordEvent";
import {Events, Guild} from "discord.js";
import {deployGlobalCommands} from "../../deployCommands";

export const eventData: DiscordEvent = {

    name: Events.GuildCreate,
    once: false,
    execute(guild: Guild) {
        //deployGlobalCommands(guild.id).then(() => console.info('Deployed commands!'));
    }
}