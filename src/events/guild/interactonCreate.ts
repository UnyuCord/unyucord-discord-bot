import { EventData } from "../../interfaces/eventData";
import { Events, Interaction } from "discord.js";
import { botClient } from "../../index";
import { sendErrorEmbed, sendErrorEmbedCustomMessage } from "../../handlers/errorHandler";
import { checkIfUserHasDbEntry, createUserDbEntry } from "../../db/dbHandler";

export const eventData: EventData = {

    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {

        if (!interaction.isCommand()) return;
        const command = botClient.slashCommands.get(interaction.commandName);

        if (command?.dbRequired) {

            if (!botClient.connectedToDb) return sendErrorEmbedCustomMessage(interaction,
                'WAGHHH AN ABNORMALITY HAS BREACHED CONTAINMENT!!! \n(***No database connection!***)');

            if (! await checkIfUserHasDbEntry(interaction.user.id)) {
                createUserDbEntry(interaction.user.id).catch(err => sendErrorEmbed(interaction, err));
            }
        }

        if (!command) return;

        try {
            // TODO: Uhhh, probably shouldnt make it always await, find a better solution idiot
            await command.run(interaction)
        } catch (error) {
            sendErrorEmbed(interaction, error);
        }
    }

}
