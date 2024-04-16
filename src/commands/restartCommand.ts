import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {botClient} from "../index";
import config from "../config.json"

export const command: SlashCommand = {

    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restarts the bot, scary!')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    run: async (interaction: CommandInteraction) => {

        await interaction.reply('Bongbongbong... restarting...').then(() => {
            botClient.client.destroy().then(() => {
                botClient.client.login(config.token);
            });
        })

        await interaction.editReply('Bongbongbong! Bot restarted!');
    }
}