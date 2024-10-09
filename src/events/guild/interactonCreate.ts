import {EventData} from "../../interfaces/eventData";
import {Events, Interaction} from "discord.js";
import {botClient} from "../../index";
import {sendErrorEmbed} from "../../handlers/errorHandler";

export const eventData: EventData = {

    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {

        if (!interaction.isCommand()) return;
        const command = botClient.slashCommands.get(interaction.commandName);

        if (!command) return;

        try {
            // TODO: Uhhh, probably shouldnt make it always await, find a better solution idiot
            await command.run(interaction)
        } catch (error) {
            sendErrorEmbed(interaction, error);
        }
    }

}