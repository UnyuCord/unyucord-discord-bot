import { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, } from "discord.js";

export interface SlashCommand {
    /*
    The second and third type seem interchangeable, sometimes for some reason it will ask for the other type instead
    so let's just use both, don't know why this happens
    */
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    dbRequired?: boolean;

    run: (interaction: CommandInteraction) => void;
}
