import {CommandInteraction, EmbedBuilder, HTTPError} from "discord.js";


export function sendErrorEmbed(interaction: CommandInteraction, error: any) {

    let errorDescription: string = 'Something went HORRIBLY wrong!';

    if (error instanceof Error) {
        errorDescription = error.message
    } else if (error instanceof HTTPError) {
        errorDescription = `${error.status} ${error.message}`
    }

    const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(':boom: BONGBONG HAS JUST EXPLODED!!! :boom:')
        .setImage("https://media.tenor.com/--tErbWBQ3AAAAAi/bongbong-explosion.gif")
        .setDescription(errorDescription)
        .setFooter({text: 'Blame Nikki for this...'})

    interaction.reply({embeds: [errorEmbed]});
}