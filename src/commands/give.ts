import {SlashCommand} from "../interfaces/slashCommand";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandUserOption
} from "discord.js";
import {userModel} from "../db/schemas/userSchema";
import {checkDbProfileExists} from "../db/dbHandler";
import config from "../resources/config.json";

export const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give another user currency.')
        .addUserOption(new SlashCommandUserOption()
            .setName('user')
            .setDescription('The recipient of the currency')
            .setRequired(true))
        .addNumberOption(new SlashCommandNumberOption()
            .setName('amount')
            .setDescription('The amount of currency to be given.')
            .setRequired(true)),
    dbRequired: true,
    async run(interaction) {

        if (!interaction.isChatInputCommand()) return;

        const chatInputCommandInteraction = interaction as ChatInputCommandInteraction;
        const recipientUser = chatInputCommandInteraction.options.getUser('user', true);
        const amount = chatInputCommandInteraction.options.getNumber('amount', true);
        const senderDbUser = await userModel.findOne({discordId: interaction.user.id});
        const recipientDbUser = await checkDbProfileExists(recipientUser.id);

        if (senderDbUser) {

            senderDbUser.ahn -= amount;
            recipientDbUser.ahn += amount;

            await senderDbUser.save();
            await recipientDbUser.save();

            await interaction.reply(`${interaction.user.displayName} sent ${recipientUser.displayName} ${amount}${config.currencyName}`);

        } else return;
    }
}