import {CommandInteraction, EmbedBuilder} from "discord.js";


export function sendErrorEmbed(interaction: CommandInteraction, errorDescription: string) {

    // TODO: This url will expire some day, maybe store gif locally?
    const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(':boom: BONGBONG HAS JUST EXPLODED!!! :boom:')
        .setImage("https://cdn.discordapp.com/attachments/1083826396314480742/1230149314836434945/3dgifmaker75955.gif?ex=663244d3&is=661fcfd3&hm=b49d349d923266fba726163f593751779f289ee1d30217776f03337b60fe12ac&")
        .setDescription(errorDescription)
        .setFooter({text: 'Blame Nikki for this...'})

    interaction.reply({embeds: [errorEmbed]});
}