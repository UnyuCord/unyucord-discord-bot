import {ChatInputApplicationCommandData, Client, CommandInteraction, SlashCommandBuilder} from "discord.js";

export interface SlashCommand {
    data: SlashCommandBuilder;
    run: (interaction: CommandInteraction) => void;
}