import {userModel} from "./schemas/userSchema";

export async function checkDbProfileExists(discordUserId: String) {

    let discordUserProfile = await userModel.findOne({discordId: discordUserId});

    if (!discordUserProfile) {
        discordUserProfile = await userModel.create({
            discordId: discordUserId,
        });

        discordUserProfile.save();
    }

    return discordUserProfile;
}