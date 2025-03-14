import {
    CommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface SlashCommand {
    /*
    The second and third type seem interchangeable, sometimes for some reason it will ask for the other type instead
    so let's just use both, don't know why this happens
    */
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | SlashCommandSubcommandsOnlyBuilder;
    dbRequired?: boolean;

    run(interaction: CommandInteraction): any;
}
