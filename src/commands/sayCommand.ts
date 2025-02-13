import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, SlashCommandBuilder, SlashCommandStringOption} from "discord.js";


export const command: SlashCommand = {

    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Makes the bot say something.')
        .addStringOption(
            new SlashCommandStringOption()
                .setName('message')
                .setDescription('The message the bot should say.')
                .setRequired(true)
        ),

    run: (interaction: CommandInteraction) => {

        if (!interaction.isChatInputCommand()) return;

        const message = interaction.options.getString('message');

        if (message) {
            void interaction.reply(message);
        }
    }


}
