import {DiscordEvent} from "../../interfaces/discordEvent";
import {Events, Interaction} from "discord.js";
import {botClient} from "../../index";

export const eventData: DiscordEvent = {

    name: Events.InteractionCreate,
    once: false,
    execute(interaction: Interaction) {

        if (!interaction.isCommand()) return;
        const command = botClient.slashCommands.get(interaction.commandName);

        if (!command) return;

        command.run(interaction)
    }

}