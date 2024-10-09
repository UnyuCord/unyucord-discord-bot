import {Events} from "discord.js";

export interface EventData {
    name: Events | string;
    once: Boolean;
    execute: (...args: any) => void;

}