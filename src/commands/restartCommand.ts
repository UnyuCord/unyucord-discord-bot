import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {botClient} from "../index";
import config from "../resources/config.json"
import {sendErrorEmbed} from "../handlers/errorHandler";

export const command: SlashCommand = {

    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restarts the bot, scary!')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async run(interaction: CommandInteraction) {

        interaction.reply('Bongbongbong... restarting...').then(() => {
            botClient.client.destroy().then(() => {
                botClient.client.login(config.token);
            });
        }).catch(error => sendErrorEmbed(interaction, error.message));

        await interaction.editReply('Bongbongbong! Bot restarted!');
    }
}