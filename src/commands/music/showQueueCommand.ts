import {SlashCommand} from "../../interfaces/slashCommand";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {guildQueues} from "../../handlers/musicHandler";
import {sendGenericErrorEmbed, sendWarnEmbed} from "../../handlers/errorHandler";
import config from "../../resources/config.json";
import {logError} from "../../handlers/logHandler";
import {SongEntry} from "../../classes/songEntry";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the player\'s queue.'),

    run: async function (interaction) {
        if (!interaction.guildId) return sendGenericErrorEmbed(interaction)
        const guildId = interaction.guildId

        let guildQueue = guildQueues.get(interaction.guildId);

        if (!guildQueue || guildQueue.length == 0) return sendWarnEmbed(interaction, 'The queue is currently empty.');

        let formattedSongEntriesList = '';
        const maxTitleLength = 50;
        const maxSongsPerPage = 10;

        let pages = Math.ceil(guildQueue.length / maxSongsPerPage);
        let currentPage = 1

        formattedSongEntriesList = iterateOverSongs(guildQueue);

        const pageActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('queuePreviousPage')
                .setStyle(ButtonStyle.Primary)
                .setLabel('<')
                .setDisabled(currentPage <= 1),
            new ButtonBuilder()
                .setCustomId('queueNextPage')
                .setStyle(ButtonStyle.Primary)
                .setLabel('>')
                .setDisabled(currentPage >= pages)
        );

        const queueEmbed = new EmbedBuilder()
            .setColor(`#${config.bongColor}`)
            .setTitle(`Queue for ${interaction.guild?.name}`)
            .setDescription(formattedSongEntriesList)
            .setFooter({text: `Page ${currentPage}/${pages}`})

        const originalMessage = await interaction.reply({
            fetchReply: true,
            embeds: [queueEmbed],
            components: [pageActionRow]
        })

        const searchButtonCollector = originalMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 20000
        });

        searchButtonCollector.on('collect', async (collectedInteraction) => {
            if (collectedInteraction.user.id !== interaction.user.id) return;

            guildQueue = guildQueues.get(guildId);
            if (!guildQueue || guildQueue.length == 0) return sendWarnEmbed(interaction, 'The queue is currently empty.');
            searchButtonCollector.resetTimer();
            pages = Math.ceil(guildQueue.length / maxSongsPerPage)

            switch (collectedInteraction.customId) {
                case 'queuePreviousPage':
                    if (--currentPage < 1) currentPage = 1;
                    break;
                case 'queueNextPage':
                    if (++currentPage > pages) currentPage = pages;
                    break;
                default:
                    logError("This shouldn't happen right?")
                    break;
            }

            formattedSongEntriesList = ``

            formattedSongEntriesList = iterateOverSongs(guildQueue)
            queueEmbed
                .setDescription(formattedSongEntriesList)
                .setFooter({text: `Page ${currentPage}/${pages}`})

            pageActionRow.components[0].setDisabled(currentPage <= 1);
            pageActionRow.components[1].setDisabled(currentPage >= pages);

            await collectedInteraction.deferUpdate();
            await originalMessage.edit({embeds: [queueEmbed], components: [pageActionRow]})
        })


        searchButtonCollector.once('end', () => {
            originalMessage.edit({embeds: [queueEmbed], components: []})
        });


        function iterateOverSongs(guildQueue: SongEntry[]): string {
            let pageSongTitles = ``
            for (let i = 0; i < maxSongsPerPage; i++) {
                if (i + (currentPage - 1) * maxSongsPerPage < guildQueue.length) {
                    const currentSong = guildQueue[i + (currentPage - 1) * maxSongsPerPage];
                    if (!currentSong.videoInfo || !currentSong.videoInfo.basic_info || !currentSong.videoInfo.basic_info.title) return ``
                    if (currentSong.videoInfo.basic_info.title.length > maxTitleLength) {
                        const formattedTruncatedSongTitle = currentSong.videoInfo?.basic_info?.title?.substring(0, maxTitleLength - 1) + "..."
                        pageSongTitles += `${i + (currentPage - 1) * maxSongsPerPage + 1}. ${formattedTruncatedSongTitle} - ${currentSong.addedBy}\n`;
                    } else {
                        pageSongTitles += `${i + (currentPage - 1) * maxSongsPerPage + 1}. ${currentSong.videoInfo?.basic_info?.title ?? ""} - ${currentSong.addedBy}\n`;
                    }
                }
            }

            return pageSongTitles;
        }
    }

}