import {CommandInteraction, SlashCommandBuilder,} from "discord.js";

export interface SlashCommand {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    run: (interaction: CommandInteraction) => void;
}