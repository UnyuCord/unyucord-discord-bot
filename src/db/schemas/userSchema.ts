import {botClient} from "../../index";

const userSchema = new botClient.db.Schema({
    discordId: { type: String, require: true, unique: true },
    ahn: { type: Number, default: 100 }
});

export const userModel = botClient.db.model('users', userSchema);