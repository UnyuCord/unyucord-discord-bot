import {SlashCommand} from "../../interfaces/slashCommand";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel} from "@discordjs/voice";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the VC you are currently in.'),

    async run(interaction) {

        await connectToSenderVc(interaction);
        await interaction.reply('Hola');

    }
}

export async function connectToSenderVc(interaction: CommandInteraction) {

    if (!interaction.guild) return;
    const existingVoiceConnectionInGuild = getVoiceConnection(interaction.guild.id);
    if (existingVoiceConnectionInGuild) return existingVoiceConnectionInGuild;

    const channels = await interaction.guild.channels.fetch();
    const userVoiceChannel = channels
        .filter(channel => channel?.isVoiceBased())
        .find(channel => channel?.members.has(interaction.user.id));

    if (!userVoiceChannel) return;

    return joinVoiceChannel({
        adapterCreator: userVoiceChannel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        channelId: userVoiceChannel.id,
        guildId: userVoiceChannel.guildId
    });
}