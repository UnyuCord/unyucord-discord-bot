import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {botClient} from "../index";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('bong')
        .setDescription('Pings Bongbong and the Discord API, displays latency.'),


    run(interaction: CommandInteraction): void {
        interaction.reply({content: 'Bong...', fetchReply: true}).then(reply => {
            interaction.editReply(`Bong...bong!
            \n**Bot latency: ${reply.createdTimestamp - interaction.createdTimestamp}ms
            \nAPI latency: ${Math.round(botClient.client.ws.ping)}ms**
            `)
        });
    }

}