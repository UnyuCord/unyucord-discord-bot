import {botClient} from "../../index";

const musicChannelSchema = new botClient.db.Schema({
    guildId: {type: String, require: true, unique: true},
    channelId: {type: String, require: true, unique: true}
});

export const musicChannelModel = botClient.db.model("musicChannels", musicChannelSchema);