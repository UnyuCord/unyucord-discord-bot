import {SlashCommand} from "../interfaces/slashCommand";
import {
    ChatInputCommandInteraction,
    CommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption
} from "discord.js";


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

        if (interaction.isChatInputCommand()) {

            const commandInteraction = interaction as ChatInputCommandInteraction;
            const message = commandInteraction.options.getString('message');

            if (message) {
                interaction.reply(message);
            }
        }
    }


}
