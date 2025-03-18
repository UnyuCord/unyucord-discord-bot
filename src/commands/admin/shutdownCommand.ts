import {SlashCommand} from "../../interfaces/slashCommand";
import {CommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {botClient} from "../../index";

export const command: SlashCommand = {

    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('You... want to kill Bongbong? :(')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    run: async (interaction: CommandInteraction) => {

        await interaction.reply('Shutting down... bye bye...!');
        await botClient.client.destroy();
    }
}