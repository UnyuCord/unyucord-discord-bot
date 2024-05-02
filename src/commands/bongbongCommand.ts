import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import config from "../resources/config.json"


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('bongbong')
        .setDescription('Random bongbong gif!'),

    async run(interaction: CommandInteraction) {

        const color = "#003bb9";
        const embed = new EmbedBuilder()
            .setTitle('Bongbong!')
            .setDescription('Thats me...!!!')
            .setImage(config.bongGifs[Math.floor(Math.random() * config.bongGifs.length)])
            .setColor(color)

        interaction.reply({embeds: [embed]});
    }

}