//TODO: Write to a log file when cli flag is set for easier server error diagnostic
import {AnsiEscapeColors} from "../resources/ansiEscapeColors";

export function logInfo(content: string) {
    const timestamp = new Date().toLocaleString('en-GB', {timeZone: 'CET'});
    console.info(`[${timestamp}] ` + content);
}

export function logWarning(content: string) {
    const timestamp = new Date().toLocaleString('en-GB', {timeZone: 'CET'});
    console.warn(`[${timestamp}] ` + AnsiEscapeColors.Yellow + content + AnsiEscapeColors.Reset);
}

export function logError(content: string) {
    const timestamp = new Date().toLocaleString('en-GB', {timeZone: 'CET'});
    console.error(`[${timestamp}] ` + AnsiEscapeColors.Red + content + AnsiEscapeColors.Reset);
}

export function logSuccess(content: string) {
    const timestamp = new Date().toLocaleString('en-GB', {timeZone: 'CET'});
    console.info(`[${timestamp}] ` + AnsiEscapeColors.Green + content + AnsiEscapeColors.Reset);
}