import {userModel} from "./schemas/userSchema";
import {musicChannelModel} from "./schemas/musicChannelSchema";

export async function checkDbProfileExists(discordUserId: string) {

    let discordUserProfile = await userModel.findOne({discordId: discordUserId});
  
    if (!discordUserProfile) {
        discordUserProfile = await userModel.create({
            discordId: discordUserId,
        });

        await discordUserProfile.save();
    }

    return discordUserProfile;
}

export async function checkMusicChannelSet(guildId: string) {

    return (await musicChannelModel.findOne({guildId: guildId}));
}