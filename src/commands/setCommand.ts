import {SlashCommand} from "../interfaces/slashCommand";
import {
    ChannelType,
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandSubcommandBuilder,
    Snowflake
} from "discord.js";
import {musicChannelModel} from "../db/schemas/musicChannelSchema";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set things! Will probably be expanded...')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('channel')
            .setDescription('Set the channel for music commands')
            .addChannelOption(new SlashCommandChannelOption()
                .setName('channel')
                .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice])
                .setDescription('The channel for music commands.')
                .setRequired(true))),
    dbRequired: true,
    run(interaction) {

        if (!interaction.isChatInputCommand()) return

        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case 'channel':
                void setMusicChannel(interaction.options.getChannel('channel', true).id);
                break;
        }
        // Todo: for some fucking reason the fields are inverted????? gotta check that
        async function setMusicChannel(channelId: Snowflake) {

            let musicChannel = await musicChannelModel.findOne({guildId: interaction.guildId});

            if (musicChannel) {
                musicChannel.channelId = interaction.channelId;
            } else {
                musicChannel = await musicChannelModel.create({
                    channelId: channelId,
                    guildId: interaction.guildId
                });
            }

            musicChannel.save();
            void interaction.reply({content: 'Saved music channel!', ephemeral: true});

        }
    }

}