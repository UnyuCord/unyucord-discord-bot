import {Events} from "discord.js";

export interface DiscordEvent {
    name: string;
    once: Boolean;
    execute: (...args: any) => void;

}