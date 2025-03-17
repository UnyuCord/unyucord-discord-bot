import {SlashCommand} from "../interfaces/slashCommand";
import {SlashCommandBuilder} from "discord.js";
import {sendGenericErrorEmbed, sendWarnEmbed} from "../handlers/errorHandler";
import {audioPlayers, guildQueues, playNextAudio, removeFirstFromQueue} from "../handlers/musicHandler";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song and plays the next one.'),

    run: function (interaction) {
        if (!interaction.guildId) return sendGenericErrorEmbed(interaction);

        const queue = guildQueues.get(interaction.guildId);
        const player = audioPlayers.get(interaction.guildId);

        if (!queue || queue.length == 0 || !player) return sendWarnEmbed(interaction, 'The queue is currently empty.');

        const songTitle = queue[0].videoInfo.basic_info.title;

        if (queue.length == 1) {
            removeFirstFromQueue(interaction.guildId);
            player.stop(true);

        } else void playNextAudio(interaction.guildId, interaction);

        void interaction.reply(`Skipped ${songTitle}`);

    }
}