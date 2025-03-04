import {SlashCommand} from "../interfaces/slashCommand";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder
} from "discord.js";
import {audioPlayers, guildQueues} from "../handlers/musicHandler";
import {sendWarnEmbed} from "../handlers/errorHandler";
import {AudioPlayerStatus} from "@discordjs/voice";
import config from "../resources/config.json";

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
    run: function (interaction: CommandInteraction): any {

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
                .setFooter({text: `Added by ${guildQueue[0].addedBy}`})

            void interaction.reply({embeds: [playingNowEmbed]});
        }

        function pausePlayer() {

            const audioPlayer = audioPlayers.get(guildId);

            if (audioPlayer?.state.status != AudioPlayerStatus.Playing) return sendWarnEmbed(interaction, 'I\'m not playing anything!');

            audioPlayer.pause();
            void interaction.reply({content: 'Paused the player!'})

        }

        function resumePlayer() {

            const audioPlayer = audioPlayers.get(guildId);

            if (audioPlayer?.state.status != AudioPlayerStatus.Playing) return sendWarnEmbed(interaction, 'I\'m not playing anything!');

            audioPlayer.unpause();
            void interaction.reply({content: 'Resumed the player!'})

        }

        function showQueue() {

            const guildQueue = guildQueues.get(guildId);

            if (!guildQueue || guildQueue.length == 0) return sendWarnEmbed(interaction, 'The queue is currently empty.');

            const formattedSongEntriesList = '';

            guildQueue.forEach(songEntry => {

            });

            const pageActionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('queuePreviousPage')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('<'),
                new ButtonBuilder()
                    .setCustomId('queueNextPage')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('>')
            );


        }


    }
}