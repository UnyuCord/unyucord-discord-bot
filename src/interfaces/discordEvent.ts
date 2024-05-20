import {Events} from "discord.js";

export interface DiscordEvent {
    name: Events;
    once: Boolean;
    execute: (...args: any) => void;

}