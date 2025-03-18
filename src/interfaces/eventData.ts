export interface EventData {
    name: string;
    once: boolean;
    run: (...args: any) => void | Promise<void>;
}