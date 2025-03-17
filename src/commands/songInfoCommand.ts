import {SlashCommand} from "../interfaces/slashCommand";
import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {audioPlayers, guildQueues} from "../handlers/musicHandler";
import {AudioPlayerStatus} from "@discordjs/voice";
import {sendWarnEmbed} from "../handlers/errorHandler";
import config from "../resources/config.json";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription('Show info about the currently playing song'),
    run(interaction: CommandInteraction): any {
        if (!interaction.isChatInputCommand() || !interaction.guildId) return;

        const guildId = interaction.guildId;

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

}