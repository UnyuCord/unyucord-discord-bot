import {SlashCommand} from "../interfaces/slashCommand";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    CommandInteraction,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import axios from "axios";
import {GoogleSearchResponse} from "../interfaces/googleSearchResponse";
import config from '../resources/config.json'
import * as https from "https";
import {logError} from "../handlers/logHandler";


export const command: SlashCommand = {

    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Search for an image through google images. (Unfortunately this is limited to 100 a day...)')
        .addStringOption(options => {
            return options
                .setName('query')
                .setDescription('Image search query.')
                .setRequired(true)
        }),

    async run(interaction: CommandInteraction): Promise<void> {

        if (interaction.isChatInputCommand()) {

            const chatInputCommand = interaction as ChatInputCommandInteraction;
            const agent = new https.Agent({rejectUnauthorized: true, requestCert: true});
            let query = chatInputCommand.options.getString('query');
            let imageIndex = 0;

            if (!query) return;

            const urlQuery = query.replaceAll(' ', '%20');

            const getUrl =
                `${config.googleSearchEndpointPrefix}?key=${config.googleApiKey}&cx=${config.googleImageClientId}&q=${urlQuery}&num=10&safe=active&searchType=image`;

            await axios.get<GoogleSearchResponse>(getUrl, {httpsAgent: agent}).then(async response => {

                if (!response.data.items) return interaction.reply({content: 'No results found :(', ephemeral: true});

                const googleSearchEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setImage(response.data.items[imageIndex].link)
                    .setDescription(response.data.items[imageIndex].image.contextLink)
                    .setTitle(response.data.items[imageIndex].snippet)
                    .setFooter({text: `Images for ${query} | Result ${imageIndex + 1}/${response.data.items.length}`});

                const googleSearchActionRow = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        // Image always starts on index 1 so disable previous button
                        new ButtonBuilder()
                            .setCustomId('googleSearchPrevious')
                            .setLabel('<')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('googleSearchRandom')
                            .setLabel('?')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('googleSearchNext')
                            .setLabel('>')
                            .setStyle(ButtonStyle.Primary)
                    );

                const originalMessage = await interaction.reply({
                    fetchReply: true,
                    embeds: [googleSearchEmbed],
                    components: [googleSearchActionRow]
                });

                const searchButtonCollector = originalMessage.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 20000
                });

                searchButtonCollector.on('collect', async (collectedInteraction: CommandInteraction) => {

                    if (!collectedInteraction.isButton()) return;

                    const button = collectedInteraction as ButtonInteraction

                    if (button.user.id !== interaction.user.id) return;
                    searchButtonCollector.resetTimer()

                    switch (button.customId) {
                        case 'googleSearchPrevious':
                            imageIndex--;
                            break;
                        case 'googleSearchNext':
                            imageIndex++;
                            break;
                        case 'googleSearchRandom':
                            imageIndex = Math.floor(Math.random() * response.data.items.length);
                            break;
                        default:
                            logError('uhh... this isnt supposed to happen right?')
                            imageIndex = 0;
                            break;
                    }

                    googleSearchEmbed
                        .setImage(response.data.items[imageIndex].link)
                        .setTitle(response.data.items[imageIndex].snippet)
                        .setDescription(response.data.items[imageIndex].image.contextLink)
                        .setFooter({text: `Images for ${query} | Result ${imageIndex + 1}/10`});

                    if (imageIndex !== 0) googleSearchActionRow.components[0].setDisabled(false);
                    else googleSearchActionRow.components[0].setDisabled(true);

                    if (imageIndex !== response.data.items.length - 1) googleSearchActionRow.components[2].setDisabled(false);
                    else googleSearchActionRow.components[2].setDisabled(true);

                    await button.deferUpdate();
                    await originalMessage.edit({embeds: [googleSearchEmbed], components: [googleSearchActionRow]});

                });

                searchButtonCollector.on('end', () => {
                    googleSearchEmbed.setFooter({text: `Images for ${query} | Search timed out`});
                    originalMessage.edit({embeds: [googleSearchEmbed], components: []});
                });

            });


        }
    }
}