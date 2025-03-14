import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import config from "../resources/config.json"

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('eightball')
        .setDescription("Ask Bongbong something! Uh... usually gives an answer!")
        .addStringOption(options => {
            return options
                .setName('question')
                .setDescription('The question you want to ask.')
                .setRequired(true)
        }),

    run: (interaction: CommandInteraction) => {

        if (!interaction.isChatInputCommand()) return;

        const answer = config.eightBallResponses[Math.floor(Math.random() * config.eightBallResponses.length)];
        const eightBallEmbed = new EmbedBuilder()
            .setColor(`#${config.bongColor}`)
            .setTitle(':8ball: ' + interaction.options.getString('question'))
            .setDescription(answer);


        void interaction.reply({embeds: [eightBallEmbed]});
    }
}