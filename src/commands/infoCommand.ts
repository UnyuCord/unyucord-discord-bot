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

            if (!user) user = commandInteraction.user
            let server = commandInteraction.guild;


            if (!server) return;
            server.members.fetch(user.id).then(member => {

                if (member.joinedAt) {

                    let memberRoles = '';
                    member.roles.cache.forEach(role =>  {
                        memberRoles += `<@&${role.id}> `;
                    });

                    // Replace role id that matches guild id, as it is the @everyone role and is irrelevant
                    memberRoles = memberRoles.replace(`<@&${server.id}>`, '');
                    const infoEmbed = new EmbedBuilder()
                        .setColor(`${member.displayHexColor}`)
                        .setTitle(`User ${member.user.username}`)
                        .setThumbnail(user.avatarURL())
                        .addFields(
                            {name: 'Nickname', value: `${member.nickname || 'None'}`},
                            {name: 'Display name', value: user.displayName},
                            {name: 'Id', value: user.id},
                            {name: 'Account creation date', value: `${user.createdAt}`},
                            {name: 'Member since', value: `<t:${Math.floor(member.joinedAt.valueOf() / 1000)}:R>`},
                            {name: 'Roles', value: memberRoles || 'None'}
                        )

                    interaction.reply({embeds: [infoEmbed]});
                }
            });
        }
    }

}
