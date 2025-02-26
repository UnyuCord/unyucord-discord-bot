import {VideoInfo} from "youtubei.js/dist/src/parser/youtube";

export class SongEntry {
    addedBy: string;
    videoInfo: VideoInfo

    constructor(addedBy: string, videoInfo: VideoInfo) {
        this.addedBy = addedBy;
        //TODO: Maybe have a custom object here with all the required info where the fields arent potentially undefined
        this.videoInfo = videoInfo;
    }
}