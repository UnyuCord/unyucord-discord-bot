import {SlashCommand} from "../interfaces/slashCommand";
import {ApplicationCommandType, Client} from "discord.js";

export const TestCommand: SlashCommand = {
    name: 'Test',
    description: 'Test command',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction) => {
        const content = ':3';

        await interaction.followUp({
            ephemeral: true,
            content
        })
    }
}