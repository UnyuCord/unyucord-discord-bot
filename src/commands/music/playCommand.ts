import {SlashCommand} from "../../interfaces/slashCommand";
import {EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption} from "discord.js";
import {AudioPlayer, AudioPlayerStatus, createAudioPlayer, getVoiceConnection, VoiceConnection} from "@discordjs/voice";
import {
    addToQueue,
    audioPlayers,
    guildQueues,
    idleTimeOut,
    playAudio,
    playNextAudio
} from "../../handlers/musicHandler";
import {botClient} from "../../index";
import {sendWarnEmbed} from "../../handlers/errorHandler";
import config from "../../resources/config.json";
import {connectToSenderVc} from "./joinCommand";
import {checkMusicChannelSet} from "../../db/dbHandler";
import {SongEntry} from "../../classes/songEntry";

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

        if (!interaction.guildId || !interaction.isChatInputCommand()) return;

        const guildId = interaction.guildId;

        if (!await checkMusicChannelSet(interaction.guildId)) return sendWarnEmbed(interaction, 'Music channel is not set, set it with `/set channel`');

        const videoId = new URL(interaction.options.getString('url', true)).searchParams.get('v');

        if (!videoId) return;

        const videoInfo = await botClient.innertube.getBasicInfo(videoId);
        const addedToQueueEmbed = new EmbedBuilder()
            .setColor(`#${config.bongColor}`)
            .setDescription(`Added ${videoInfo.basic_info.title} to queue.`);

        let audioPlayer: AudioPlayer | undefined = audioPlayers.get(interaction.guildId);
        let connection: VoiceConnection | undefined = getVoiceConnection(interaction.guildId);

        addToQueue(interaction.guildId, new SongEntry(interaction.user.username, videoInfo));

        const queue = guildQueues.get(interaction.guildId);

        if (!queue) return;

        if (!connection) {
            audioPlayer = createAudioPlayer();
            audioPlayers.set(interaction.guildId, audioPlayer);
            connection = await connectToSenderVc(interaction);
            if (connection) {
                connection.subscribe(audioPlayer);
                audioPlayer.on(AudioPlayerStatus.Idle, () => playNextAudio(guildId, interaction));
            }
        } else if (!audioPlayer) {
            audioPlayer = createAudioPlayer();
            audioPlayers.set(interaction.guildId, audioPlayer);
        }

        if (queue.length == 1) {
            const ongoingIdleTimeout = idleTimeOut.get(interaction.guildId);
            if (ongoingIdleTimeout) {
                clearTimeout(ongoingIdleTimeout);
                idleTimeOut.delete(interaction.guildId);
            }
            await playAudio(queue[0], interaction, audioPlayer);
        }
        await interaction.reply({embeds: [addedToQueueEmbed]});


    }
}