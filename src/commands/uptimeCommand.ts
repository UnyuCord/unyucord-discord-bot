import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {botClient} from "../index";
import {sendErrorEmbed} from "../handlers/errorHandler";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Returns the uptime of the bot.'),

    run: (interaction: CommandInteraction) => {

        let seconds, minutes, hours, days = 0;

        if (!botClient.client.uptime) return sendErrorEmbed(interaction, 'Client uptime is null??? SOMEHOW???')

        seconds = Math.floor(botClient.client.uptime / 1000);
        minutes = Math.floor(seconds / 60);
        hours = Math.floor(minutes / 60);
        days = Math.floor(hours / 24);

        interaction.reply(`The bot's uptime is: ${days} days, ${hours - days * 24} hours, ${minutes - hours * 60} minutes and ${seconds - minutes * 60} seconds`);

    }
}