import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import config from "../resources/config.json"


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('bongbong')
        .setDescription('Random bongbong gif!'),

    run(interaction: CommandInteraction) {

        const embed = new EmbedBuilder()
            .setTitle('Bongbong!')
            .setDescription('Thats me...!!!')
            .setImage(config.bongGifs[Math.floor(Math.random() * config.bongGifs.length)])
            .setColor(`#${config.bongColor}`)

         void interaction.reply({embeds: [embed]});
    }

}
