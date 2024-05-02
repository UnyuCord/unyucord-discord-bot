import {GoogleImage} from "./googleImage";

export interface GoogleImageData {
    "kind": string,
    "title": string,
    "htmlTitle": string,
    "link": string,
    "displayLink": string,
    "snippet": string,
    "htmlSnippet": string,
    "mime": string,
    "fileFormat": string,
    "image": GoogleImage
}