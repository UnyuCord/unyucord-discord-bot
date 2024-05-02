import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import classpect from "../resources/classpect.json";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('classpect')
        .setDescription('Generate a random classpect!'),

    run: (interaction: CommandInteraction) => {

        const classpectClass = classpect.classes[Math.floor(Math.random() * classpect.classes.length)];
        const classpectAspect = classpect.aspects[Math.floor(Math.random() * classpect.aspects.length)];
        const classpectBlood = classpect.blood[Math.floor(Math.random() * classpect.blood.length)];
        const classpectMoon = Math.round(Math.random()) ? 'prospit' : 'derse';

        const classpectEmbed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`${classpectClass} of ${classpectAspect}, ${classpectBlood}, ${classpectMoon}`);

        interaction.reply({embeds: [classpectEmbed]});
    }
}