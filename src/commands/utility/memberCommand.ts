import {SlashCommand} from "../../interfaces/slashCommand";
import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import config from "../../resources/config.json";
import {botClient} from '../../index';
import {checkDbProfileExists} from "../../db/dbHandler";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('Displays information about either you, or a selected user.')
        .addMentionableOption(option => {
            return option.setName('user')
                .setDescription('A Discord user.')
        }),

    async run(interaction: CommandInteraction) {

        if (!interaction.isChatInputCommand()) return;

        let user = interaction.options.getUser('user');

        if (!user) user = interaction.user;

        let server = interaction.guild;
        let ahn: string = '-';

        if (botClient.connectedToDb) {
            const result = await checkDbProfileExists(interaction.user.id);
            ahn = `${result?.ahn}` || '-';
        }


        if (!server) return;
        server.members.fetch(user.id).then(member => {

            if (member.joinedAt) {

                let memberRoles = '';
                member.roles.cache.forEach(role => {
                    memberRoles += `<@&${role.id}> `;
                });

                // Replace role id that matches guild id, as it is the @everyone role and is irrelevant
                memberRoles = memberRoles.replace(`<@&${server.id}>`, '');
                const infoEmbed = new EmbedBuilder()
                    .setColor(`${member.displayHexColor}`)
                    .setTitle(`User ${member.user.username}`)
                    .setThumbnail(user.avatarURL())
                    .addFields(
                        {name: 'Nickname', value: `${member.nickname ?? 'None'}`},
                        {name: 'Display name', value: user.displayName},
                        {name: 'Id', value: user.id},
                        {name: config.currencyName, value: ahn},
                        {name: 'Account creation date', value: `${user.createdAt}`},
                        {name: 'Member since', value: `<t:${Math.floor(member.joinedAt.valueOf() / 1000)}:R>`},
                        {name: 'Roles', value: memberRoles || 'None'}
                    )

                interaction.reply({embeds: [infoEmbed]});
            }
        });
    }
}
