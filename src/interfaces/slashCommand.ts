import {CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder,} from "discord.js";

export interface SlashCommand {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    run: (interaction: CommandInteraction) => void;
}