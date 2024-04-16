import {SlashCommand} from "../interfaces/slashCommand";
import {ApplicationCommandType, CommandInteraction, SlashCommandBuilder} from "discord.js";

export const command: SlashCommand = {

    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command'),

    run: async (interaction: CommandInteraction) => {
        const content = ':3';
        await interaction.reply(content);
    }
}