import {SlashCommand} from "../interfaces/slashCommand";
import {EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption, TextChannel} from "discord.js";
import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    VoiceConnection
} from "@discordjs/voice";
import prism from 'prism-media';
import {addToQueue, audioPlayers, guildQueues, removeFirstFromQueue} from "../handlers/musicHandler";
import {botClient} from "../index";
import {sendErrorEmbedCustomMessage, sendWarnEmbed} from "../handlers/errorHandler";
import config from "../resources/config.json";
import {connectToSenderVc} from "./joinCommand";
import {checkMusicChannelSet} from "../db/dbHandler";
import {musicChannelModel} from "../db/schemas/musicChannelSchema";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song.')
        .addStringOption(new SlashCommandStringOption()
            .setName('url')
            .setDescription('URL of the video.')
            .setRequired(true)),
    dbRequired: true,
    async run(interaction) {

        if (!interaction.guild || !interaction.isChatInputCommand()) return;
        if (!await checkMusicChannelSet(interaction.guild.id)) return sendWarnEmbed(interaction, 'Music channel is not set, set it with `/set channel`');

        const videoId = new URL(interaction.options.getString('url', true)).searchParams.get('v');

        if (!videoId) return;

        const videoInfo = await botClient.innertube.getBasicInfo(videoId);
        const addedToQueueEmbed = new EmbedBuilder()
            .setColor(`#${config.bongColor}`)
            .setDescription(`Added ${videoInfo.basic_info.title} to queue.`);

        let audioPlayer: AudioPlayer | undefined = audioPlayers.get(interaction.guild.id);
        let connection: VoiceConnection | undefined = getVoiceConnection(interaction.guild.id);

        addToQueue(interaction.guild.id, videoId);

        const queue = guildQueues.get(interaction.guild.id);

        if (!queue) return;

        if (!connection) {
            audioPlayer = createAudioPlayer();
            audioPlayers.set(interaction.guild.id, audioPlayer);
            connection = await connectToSenderVc(interaction);
            if (connection) {
                connection.subscribe(audioPlayer);
                audioPlayer.on(AudioPlayerStatus.Idle, playNextAudio);
            }
        } else if (!audioPlayer) {
            audioPlayer = createAudioPlayer();
            audioPlayers.set(interaction.guild.id, audioPlayer);
        }

        if (queue.length == 1) {
            await playAudio(videoId);
        }
        await interaction.reply({embeds: [addedToQueueEmbed]});

        async function playNextAudio() {

            if (!interaction.guild || !queue) return;

            removeFirstFromQueue(interaction.guild.id);
            const nextSongId = queue[0];

            if (!nextSongId) return;

            await playAudio(nextSongId);

        }

        async function playAudio(videoId: string) {

            const videoInfo = await botClient.innertube.getBasicInfo(videoId);
            const streamingData = await botClient.innertube.getStreamingData(videoId);
            const audioStreamUrl = streamingData.url;
            if (!audioStreamUrl) return sendErrorEmbedCustomMessage(interaction, 'Could not stream audio');

            const playingNowEmbed = new EmbedBuilder()
                .setColor(`#${config.bongColor}`)
                .setDescription(`${videoInfo.basic_info.title} is now playing.`)

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
    }
}