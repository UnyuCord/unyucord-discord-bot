import {ChatInputApplicationCommandData, Client, CommandInteraction} from "discord.js";

export interface SlashCommand extends ChatInputApplicationCommandData {
    name: string
    run: (client: Client, interaction: CommandInteraction) => void;
}