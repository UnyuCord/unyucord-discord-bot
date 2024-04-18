import {CommandInteraction, EmbedBuilder} from "discord.js";


export function sendErrorEmbed(interaction: CommandInteraction, errorDescription: string) {

    const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(':boom: BONGBONG HAS JUST EXPLODED!!! :boom:')
        .setImage("https://media.tenor.com/--tErbWBQ3AAAAAi/bongbong-explosion.gif")
        .setDescription(errorDescription)
        .setFooter({text: 'Blame Nikki for this...'})

    interaction.reply({embeds: [errorEmbed]});
}