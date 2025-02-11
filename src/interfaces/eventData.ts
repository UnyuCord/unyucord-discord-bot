export interface EventData {
    name: string;
    once: Boolean;
    execute: (...args: any) => void;

}