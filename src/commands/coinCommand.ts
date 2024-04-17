import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Flips a coin.'),

    run: (interaction: CommandInteraction) => {

        if (Math.round(Math.random())=== 0) {
            return interaction.reply('Heads! :coin:');
        }

        interaction.reply('Tails! :coin:');

    }
}