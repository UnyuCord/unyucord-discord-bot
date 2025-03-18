import {EventData} from "../../interfaces/eventData";
import {ChannelType, Events, VoiceState} from "discord.js";
import {getVoiceConnection} from "@discordjs/voice";
import {botClient} from "../../index";
import {disconnectFromVc} from "../../handlers/musicHandler";

export const eventData: EventData = {

    name: Events.VoiceStateUpdate,
    once: false,
    async run(oldState: VoiceState, newState: VoiceState) {
        if (oldState.member?.user.bot
            || !oldState.member
            || !oldState.channelId
            || oldState.channel?.members.size === newState.channel?.members.size) return;

        const connection = getVoiceConnection(newState.guild.id);
        if (!connection) return;

        const channel = await oldState.member.guild.channels.fetch(oldState.channelId);

        if (!channel || channel.type != ChannelType.GuildVoice) return;

        const connectedMembers = channel.members.filter(member => {
            if (member.user.bot && member.user.id === botClient.client?.user?.id) return true;
            return !member.user.bot;
        }).map(member => member.id);

        if (connectedMembers.includes(botClient.client?.user?.id ?? '-1') && connectedMembers.length === 1) {
            await disconnectFromVc(oldState.guild.id, connection);
        }
    }
}