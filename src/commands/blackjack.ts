import {SlashCommand} from "../interfaces/slashCommand";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    Colors,
    CommandInteraction,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandNumberOption
} from "discord.js";
import {userModel} from "../db/schemas/userSchema";
import config from '../resources/config.json';
import {sendErrorEmbedCustomMessage} from "../handlers/errorHandler";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play Blackjack with BongBong!')
        .addNumberOption(new SlashCommandNumberOption()
            .setName('bet')
            .setDescription('The amount of currency you want to bet.')
            .setRequired(true)
            .setMinValue(1)),
    dbRequired: true,
    async run(interaction: CommandInteraction) {

        if (interaction.isChatInputCommand()) {
            const chatInputInteraction = interaction as ChatInputCommandInteraction

            const dbUserEntry = await userModel.findOne({discordId: chatInputInteraction.user.id});
            const betAmountFromInteraction = chatInputInteraction.options.getNumber('bet');
            let betAmount: number = 0;
            if (betAmountFromInteraction) {
                betAmount = betAmountFromInteraction as number;
            } else return;


            if (!dbUserEntry || !betAmount) return;

            if ((dbUserEntry.ahn < betAmount)) return interaction.reply(
                {
                    content: `You do not have enough ${config.currencyName}!`,
                    ephemeral: true
                });

            dbUserEntry.ahn -= betAmount;
            dbUserEntry.save();

            const deck: number[] = [
                2, 2, 2, 2,
                3, 3, 3, 3,
                4, 4, 4, 4,
                5, 5, 5, 5,
                6, 6, 6, 6,
                7, 7, 7, 7,
                8, 8, 8, 8,
                9, 9, 9, 9,
                10, 10, 10, 10,
                10, 10, 10, 10,
                10, 10, 10, 10,
                10, 10, 10, 10,
                11, 11, 11, 11];

            const decksInPlay: number = 6;

            const playOptionsRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('hit')
                        .setLabel('Hit')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('stand')
                        .setLabel('Stand')
                        .setStyle(ButtonStyle.Secondary)
                );

            const playerHand: number[] = [];
            const dealerHand: number[] = [];
            const blackjackDeck: number[] = [];

            for (let i = 0; i < decksInPlay; i++) {
                blackjackDeck.push(...deck);
            }

            shuffleBlackjackDeck(blackjackDeck);
            addCardToHand(playerHand);
            addCardToHand(dealerHand);
            addCardToHand(playerHand);
            checkPlayerHasBlackJack();

            const playEmbed = new EmbedBuilder()
                .setTitle(`Blackjack game with ${interaction.user.displayName}`)
                .setColor(`#${config.bongColor}`)
                .setFooter({text:`Bet: ${betAmount}${config.currencyName}`})
                .addFields(
                    {name: 'Dealer\'s hand', value: `${getSumOfHand(dealerHand)} (${dealerHand.toString()})`},
                    {name: 'Player\'s hand', value: `${getSumOfHand(playerHand)} (${playerHand.toString()})`},
                )

            const originalMessage = await interaction.reply
            ({
                fetchReply: true,
                embeds: [playEmbed],
                components: [playOptionsRow]
            });

            const playInteractionCollector = originalMessage.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 2000000
            });

            playInteractionCollector.on('collect', async (collectedInteraction: CommandInteraction) => {
                if (!collectedInteraction.isButton()) return;

                const button = collectedInteraction as ButtonInteraction;

                if (button.user.id !== interaction.user.id) return;
                playInteractionCollector.resetTimer();

                switch (button.customId) {
                    case 'hit':
                        playerHit();
                        break;

                    case 'stand':
                        await playerStand();
                        break;
                }
                await button.deferUpdate();
            });

            function shuffleBlackjackDeck(blackjackDeck: number[]) {
                let currentIndex = blackjackDeck.length;

                while (currentIndex != 0) {

                    let randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;

                    [blackjackDeck[currentIndex], blackjackDeck[randomIndex]] =
                        [blackjackDeck[randomIndex], blackjackDeck[currentIndex]];
                }
            }

            function addCardToHand(hand: number[]) {
                const indexOfToBeAddedCard = Math.floor(Math.random() * deck.length - 1)
                hand.push(blackjackDeck[indexOfToBeAddedCard]);
                blackjackDeck.splice(indexOfToBeAddedCard, 1);
            }

            function getSumOfHand(hand: number[]): number {
                let sum = 0;
                let sortedDeck = hand.toSorted();
                sortedDeck.forEach(value => {
                    if (sum + value > 21 && value == 11) {
                        sum += 1;
                    } else sum += value;
                });

                return sum;
            }

            function playerHit() {
                addCardToHand(playerHand);
                if (isBust(playerHand)) {
                    playerLost();
                } else updateEmbedValues();
            }

            async function playerStand() {
                while (getSumOfHand(dealerHand) <= 16) {
                    addCardToHand(dealerHand)

                }
                if (isBust(dealerHand)) {
                    await playerWon(betAmount * 2);
                } else determineIfGameFinished();
            }

            function isBust(hand: number[]) {
                return (getSumOfHand(hand) > 21);
            }

            function playerLost() {
                playEmbed
                    .setColor(Colors.Red)
                    .setDescription(`You lost ${betAmount}${config.currencyName}!`)
                    .setFooter({text: 'Game has ended!'});

                sendEndOfGameEmbed();
            }

            async function playerWon(wonAmount: number) {
                playEmbed
                    .setColor(Colors.Green)
                    .setDescription(`You won ${wonAmount}${config.currencyName}!`)
                    .setFooter({text: 'Game has ended!'});

                if (dbUserEntry) {
                    dbUserEntry.ahn += wonAmount;
                    dbUserEntry.save();
                    sendEndOfGameEmbed();
                } else {
                    sendErrorEmbedCustomMessage(interaction, `Error with the database!`);
                    playInteractionCollector.stop('Database error');
                }
            }

            async function tie() {
                playEmbed
                    .setColor(Colors.Yellow)
                    .setDescription(`It's a tie! You got your ${betAmount}${config.currencyName} back!`)
                    .setFooter({text: 'Game has ended!'});

                if (dbUserEntry) {
                    dbUserEntry.ahn += betAmount;
                    dbUserEntry.save();
                    sendEndOfGameEmbed();
                } else {
                    sendErrorEmbedCustomMessage(interaction, `Error with the database!`);
                    playInteractionCollector.stop('Database error');
                }
            }

            function determineIfGameFinished() {

                const playerHandSum = getSumOfHand(playerHand);
                const dealerHandSum = getSumOfHand(dealerHand);

                if (playerHandSum == dealerHandSum) {
                    if (dealerHandSum == 21) {
                        playerLost();
                    } else tie();
                } else if (playerHand.length == 2 && playerHandSum == 21) {
                    playerWon(betAmount * 1.5);
                } else if (playerHandSum > dealerHandSum) {
                    playerWon(betAmount * 2);
                } else {
                    playerLost();
                }

            }

            function checkPlayerHasBlackJack() {

                const playerHandSum = getSumOfHand(playerHand);

                if (playerHandSum == 21) {
                    addCardToHand(dealerHand);
                    updateEmbedValues();
                    const dealerHandSum = getSumOfHand(dealerHand);
                    if (playerHandSum == dealerHandSum) {
                        playerLost();
                    } else playerWon(betAmount * 1.5);
                }

            }

            function sendEndOfGameEmbed() {
                updateEmbedValues();
                originalMessage.edit({embeds: [playEmbed], components: []});
                playInteractionCollector.stop('Game ended');
            }

            function updateEmbedValues() {
                playEmbed.setFields(
                    {name: 'Dealer\'s hand', value: `${getSumOfHand(dealerHand)} (${dealerHand.toString()})`},
                    {name: 'Player\'s hand', value: `${getSumOfHand(playerHand)} (${playerHand.toString()})`}
                );
                originalMessage.edit({embeds: [playEmbed]})
            }


        } else return;
    }
}
