import {EventData} from "../../interfaces/eventData";
import {Events, Interaction} from "discord.js";
import {botClient} from "../../index";
import {sendErrorEmbed, sendErrorEmbedCustomMessage} from "../../handlers/errorHandler";
import {checkDbProfileExists} from "../../db/dbHandler";

export const eventData: EventData = {

    name: Events.InteractionCreate,
    once: false,
    execute: async function (interaction: Interaction) {

        if (!interaction.isCommand() || interaction.user.bot) return;

        const command = botClient.slashCommands.get(interaction.commandName);

        if (!command) return;

        if (command.dbRequired) {

            if (!botClient.connectedToDb) return sendErrorEmbedCustomMessage(interaction,
                'WAGHHH AN ABNORMALITY HAS BREACHED CONTAINMENT!!! \n(***No database connection!***)');

            await checkDbProfileExists(interaction.user.id);
        }

        try {
            command.run(interaction);
        } catch (error) {
            sendErrorEmbed(interaction, error);
        }
    }

}
