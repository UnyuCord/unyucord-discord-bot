import {SlashCommand} from "../../interfaces/slashCommand";
import {SlashCommandBuilder} from "discord.js";
import {audioPlayers} from "../../handlers/musicHandler";
import {AudioPlayerStatus} from "@discordjs/voice";
import {sendGenericErrorEmbed, sendWarnEmbed} from "../../handlers/errorHandler";


export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the player.'),

    run(interaction){
        if (!interaction.guildId) return sendGenericErrorEmbed(interaction)

        const audioPlayer = audioPlayers.get(interaction.guildId);

        if (audioPlayer?.state.status != AudioPlayerStatus.Paused && audioPlayer?.state.status != AudioPlayerStatus.Playing) return sendWarnEmbed(interaction, 'I\'m not playing anything!');

        audioPlayer.unpause();
        void interaction.reply({content: 'Resumed the player!'})
    }
}