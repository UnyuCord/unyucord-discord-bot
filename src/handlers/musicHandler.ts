import {Collection, CommandInteraction, EmbedBuilder, Snowflake, TextChannel} from "discord.js";
import {AudioPlayer, createAudioResource, getVoiceConnection, VoiceConnection} from "@discordjs/voice";
import {SongEntry} from "../classes/songEntry";
import {botClient} from "../index";
import {sendErrorEmbedCustomMessage, sendWarnEmbed} from "./errorHandler";
import config from "../resources/config.json";
import prism from "prism-media";
import {musicChannelModel} from "../db/schemas/musicChannelSchema";
import {VideoInfo} from "youtubei.js/dist/src/parser/youtube";

// GuildId, SongEntry
export const guildQueues: Collection<Snowflake, SongEntry[]> = new Collection<Snowflake, SongEntry[]>();
// GuildId, AudioPlayer
export const audioPlayers: Collection<Snowflake, AudioPlayer> = new Collection<Snowflake, AudioPlayer>();
// GuildId, Timeout
export const idleTimeOut: Collection<Snowflake, NodeJS.Timeout> = new Collection<Snowflake, NodeJS.Timeout>();

export function addToQueue(guildId: Snowflake, songEntry: SongEntry) {
    if (!guildQueues.has(guildId)) {
        guildQueues.set(guildId, [songEntry]);
    } else {
        const urlArray = guildQueues.get(guildId);
        if (urlArray) {
            urlArray.push(songEntry);
            guildQueues.set(guildId, urlArray);
        }
    }
}

export function removeFirstFromQueue(guildId: Snowflake) {
    const urlArray = guildQueues.get(guildId);
    if (urlArray) {
        urlArray.shift();
        guildQueues.set(guildId, urlArray);
    }
}

export async function playNextAudio(guildId: Snowflake, interaction: CommandInteraction) {

    const queue = guildQueues.get(guildId);
    const audioPlayer = audioPlayers.get(guildId)
    const voiceConnection = getVoiceConnection(guildId)
    if (!queue || !audioPlayer || !voiceConnection) return;

    removeFirstFromQueue(guildId);

    if (queue.length === 0) {

        const idleTimeOutInMs = 120000;
        const timeOut = setTimeout(() => disconnect(guildId, voiceConnection), idleTimeOutInMs);
        idleTimeOut.set(guildId, timeOut);

        return;
    }

    const nextSongEntry = queue[0];

    if (!nextSongEntry) return;

    await playAudio(nextSongEntry, interaction, audioPlayer);

}

export async function playAudio(songEntry: SongEntry, interaction: CommandInteraction, audioPlayer: AudioPlayer) {

    if (!songEntry.videoInfo.basic_info.id) return;
    const streamingData = await botClient.innertube.getStreamingData(songEntry.videoInfo.basic_info.id);
    const audioStreamUrl = streamingData.url;
    if (!audioStreamUrl) return sendErrorEmbedCustomMessage(interaction, 'Could not get stream audio.');

    const playingNowEmbed = new EmbedBuilder()
        .setColor(`#${config.bongColor}`)
        .setDescription(`${songEntry.videoInfo.basic_info.title} is now playing.`)
        .setFooter({text: `Added by ${songEntry.addedBy}`});

    const ffmpegStream = new prism.FFmpeg({
        args: [
            '-reconnect', '1',
            '-reconnect_streamed', '1',
            '-reconnect_delay_max', '5',
            '-i', audioStreamUrl,
            '-analyzeduration', '0',
            '-loglevel', '0',
            '-acodec', 'libopus',
            '-b:a', '96k',
            '-f', 'opus',
            '-ar', '48000',
            '-ac', '2'
        ]
    });

    const audioResource = createAudioResource(ffmpegStream);
    const musicChannel = await musicChannelModel.findOne({guildId: interaction.guildId});

    if (!musicChannel || !musicChannel.channelId) return sendWarnEmbed(interaction, 'Music channel is not set, set it with `/set channel`');
    if (!audioPlayer) return sendErrorEmbedCustomMessage(interaction, 'Could not get audio player.');

    await (botClient.client.channels.cache.get(musicChannel.channelId) as TextChannel).send({embeds: [playingNowEmbed]})
    audioPlayer.play(audioResource);
}

export async function disconnect(guildId: Snowflake, connection: VoiceConnection) {

    const musicChannel = await musicChannelModel.findOne({guildId: guildId});

    if (guildId || !musicChannel || !musicChannel.channelId) return;
    guildQueues.delete(guildId);
    audioPlayers.delete(guildId);
    idleTimeOut.delete(guildId);
    connection?.destroy();
    void (botClient.client.channels.cache.get(musicChannel.channelId) as TextChannel).send('No activity for two minutes, I\'m outta here!');
}