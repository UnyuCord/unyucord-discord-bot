import { SlashCommand } from "../interfaces/slashCommand";
import {
    ActionRowBuilder,
    ButtonBuilder, ButtonInteraction,
    ButtonStyle,
    CommandInteraction, ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { audioPlayers, guildQueues } from "../handlers/musicHandler";
import {sendGenericErrorEmbed, sendWarnEmbed} from "../handlers/errorHandler";
import { AudioPlayerStatus } from "@discordjs/voice";
import config from "../resources/config.json";
import { format } from "path";
import {logError} from "../handlers/logHandler";
import {SongEntry} from "../classes/songEntry";

//TODO: WIP showQueue
export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Interact with the bots player')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('info')
            .setDescription('Show info about the currently playing song'))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('pause')
            .setDescription('Pauses the player.'))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('resume')
            .setDescription('Resumes the player.'))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('queue')
            .setDescription('Displays the song queue.')),
    dbRequired: false,
    //TODO: decide if the play command should be put as a subcommand here
    run: function (interaction: CommandInteraction) {

        if (!interaction.isChatInputCommand() || !interaction.guildId) return;

        const guildId = interaction.guildId;
        const subCommand = interaction.options.getSubcommand(true);

        switch (subCommand) {
            case 'info':
                showSongInfo();
                break;
            case 'pause':
                pausePlayer();
                break;
            case 'resume':
                resumePlayer();
                break;
            case 'queue':
                showQueue();
                break;
        }

        function showSongInfo() {

            const guildQueue = guildQueues.get(guildId);
            const audioPlayer = audioPlayers.get(guildId);

            // TODO: Make whatever the hell this is prettier
            if (!guildQueue
                || !audioPlayer
                || audioPlayer.state.status != AudioPlayerStatus.Playing
                || !guildQueue[0].videoInfo.basic_info.duration
                || guildQueue.length == 0) return sendWarnEmbed(interaction, 'I\'m not playing anything!');

            const videoDuration = guildQueue[0].videoInfo.basic_info.duration;
            const songDurationMinutes = Math.floor(videoDuration / 60).toFixed(0).padStart(2, '0');
            const songDurationSeconds = Math.floor(videoDuration % 60).toFixed(0).padStart(2, '0');

            const playerDurationMinutes = Math.floor(audioPlayer.state.resource.playbackDuration / 60000).toFixed(0).padStart(2, '0');
            const playerDurationSeconds = Math.floor((audioPlayer.state.resource.playbackDuration % 60000) / 1000).toFixed(0).padStart(2, '0');

            let timelineSegments = '————————————————————'
            const circleCharacter = '⦿'

            const timelinePlaybackIndex = Math.floor(((audioPlayer.state.resource.playbackDuration / 1000) / videoDuration) * timelineSegments.length);

            timelineSegments = timelineSegments.substring(0, timelinePlaybackIndex) +
                circleCharacter +
                timelineSegments.substring(timelinePlaybackIndex + 1);

            const playingNowEmbed = new EmbedBuilder()
                .setTitle(guildQueue[0].videoInfo.basic_info.title ?? '-')
                .setColor(`#${config.bongColor}`)
                .setDescription(`${playerDurationMinutes}:${playerDurationSeconds}/${songDurationMinutes}:${songDurationSeconds}\n\`${timelineSegments}\``)
                .setFooter({ text: `Added by ${guildQueue[0].addedBy}` })

            void interaction.reply({ embeds: [playingNowEmbed] });
        }

        function pausePlayer() {

            const audioPlayer = audioPlayers.get(guildId);

            if (audioPlayer?.state.status != AudioPlayerStatus.Playing) return sendWarnEmbed(interaction, 'I\'m not playing anything!');

            audioPlayer.pause();
            void interaction.reply({ content: 'Paused the player!' })

        }

        function resumePlayer() {

            const audioPlayer = audioPlayers.get(guildId);

            if (audioPlayer?.state.status != AudioPlayerStatus.Paused && audioPlayer?.state.status != AudioPlayerStatus.Playing) return sendWarnEmbed(interaction, 'I\'m not playing anything!');

            audioPlayer.unpause();
            void interaction.reply({ content: 'Resumed the player!' })

        }

        async function showQueue() {

            function iterateOverSongs(guildQueue:SongEntry[]): string{
                let pageSongTitles = ``
                for(let i = 0; i < maxSongsPerPage; i++){
                    if(i + (currentPage - 1) * maxSongsPerPage < guildQueue.length){
                        const currentSong = guildQueue[i + (currentPage - 1) * maxSongsPerPage];
                        if (!currentSong.videoInfo) return ``
                        if (currentSong.videoInfo?.basic_info?.title?.length ?? 0 > maxTitleLength){
                            const formattedTrunctuatedSongTitle = currentSong.videoInfo?.basic_info?.title?.substring(0, maxTitleLength-1) + "..."
                            pageSongTitles += `${i + (currentPage - 1) * maxSongsPerPage + 1}. ${formattedTrunctuatedSongTitle} - ${currentSong.addedBy}\n`;
                        }else{
                            pageSongTitles += `${i + (currentPage - 1) * maxSongsPerPage + 1}. ${currentSong.videoInfo?.basic_info?.title ?? ""} - ${currentSong.addedBy}\n`;
                        }
                    }
                }

                return pageSongTitles;
            }

            let guildQueue = guildQueues.get(guildId);

            if (!guildQueue || guildQueue.length == 0) return sendWarnEmbed(interaction, 'The queue is currently empty.');

            let formattedSongEntriesList = '';
            const maxTitleLength = 50;
            const maxSongsPerPage = 10;


            formattedSongEntriesList = iterateOverSongs(guildQueue)
            let pages = Math.ceil(guildQueue.length/maxSongsPerPage);
            let currentPage = 1

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

            const originalMessage = await interaction.reply({fetchReply: true, embeds: [queueEmbed], components: [pageActionRow]})

            const searchButtonCollector = originalMessage.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 20000
            });

            searchButtonCollector.on('collect', async (collectedInteraction) => {
                if(collectedInteraction.user.id !== interaction.user.id) return;

                guildQueue = guildQueues.get(guildId);
                if (!guildQueue || guildQueue.length == 0) return sendWarnEmbed(interaction, 'The queue is currently empty.');
                searchButtonCollector.resetTimer();
                pages = Math.ceil(guildQueue.length/maxSongsPerPage)

                switch(collectedInteraction.customId){
                    case 'queuePreviousPage':
                        if(--currentPage < 1) currentPage = 1;
                        break;
                    case 'queueNextPage':
                        if(++currentPage > pages) currentPage = pages;
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


        }


    }
}