import {SlashCommand} from "../interfaces/slashCommand";
import {ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays information about either you, or a selected user.')
        .addMentionableOption(option => {
            return option.setName('user')
                .setDescription('A Discord user.')
        }),

    run(interaction: CommandInteraction): void {

        if (interaction.isChatInputCommand()) {

            const commandInteraction = interaction as ChatInputCommandInteraction;
            let user = commandInteraction.options.getUser('user');
            let server = commandInteraction.guild;

            if (!server) return;
            if (!user) user = commandInteraction.user

            const infoEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`User ${user.globalName}`)
                .setThumbnail(user.avatarURL())
                .addFields(
                    {name: 'Display name', value: user.displayName},
                    {name: 'Tag', value: user.tag},
                    {name: 'Id', value: user.id},
                    {name: 'Account creation date', value: `${user.createdAt}`}
                )

            interaction.reply({embeds: [infoEmbed]});

        }
    }

}