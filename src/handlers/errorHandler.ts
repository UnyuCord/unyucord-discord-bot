import {CommandInteraction, EmbedBuilder, HTTPError} from "discord.js";
import {logError} from "./logHandler";

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

    logError(error);
  
    if (interaction.replied) {
        void interaction.followUp({embeds: [errorEmbed], ephemeral: true});
    } else void interaction.reply({embeds: [errorEmbed], ephemeral: true});
}

export function sendErrorEmbedCustomMessage(interaction: CommandInteraction, errorMessage: string) {

    const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(':boom: BONGBONG HAS JUST EXPLODED!!! :boom:')
        .setImage("https://media.tenor.com/--tErbWBQ3AAAAAi/bongbong-explosion.gif")
        .setDescription(errorMessage)
        .setFooter({text: 'Blame Nikki for this...'});

    logError(errorMessage);
    if (interaction.replied) {
        void interaction.followUp({embeds: [errorEmbed], ephemeral: true});
    } else void interaction.reply({embeds: [errorEmbed], ephemeral: true});
}

export function sendWarnEmbed(interaction: CommandInteraction, message: string) {
    const warnEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle('Something went wrong!')
        .setDescription(message);

    if (interaction.replied) {
        void interaction.followUp({embeds: [warnEmbed], ephemeral: true});
    } else void interaction.reply({embeds: [warnEmbed], ephemeral: true});
}

export function sendGenericErrorEmbed(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('An error has occured!')
        .setDescription('Please try again.')

    if(interaction.replied) {
        void interaction.followUp({embeds: [embed], ephemeral: true});
    } else void interaction.reply({embeds: [embed], ephemeral: true})
}