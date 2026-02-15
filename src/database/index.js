import Friendships from "./models/friendships.js";
import Invites from "./models/invites.js";
import Tokens from "./models/tokens.js";
import UserProfile from "./models/userProfile.js";

UserProfile.hasMany(Friendships, { foreignKey: "senderId", as: "SentRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "senderId", as: "Sender" });
UserProfile.hasMany(Friendships, { foreignKey: "receiverId", as: "ReceivedRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "receiverId", as: "Receiver" });

UserProfile.hasMany(Invites, { foreignKey: "senderId", as: "SentInvites" });
Invites.belongsTo(UserProfile, { foreignKey: "senderId", as: "Sender" });
UserProfile.hasMany(Invites, { foreignKey: "invitedId", as: "ReceivedInvites" });
Invites.belongsTo(UserProfile, { foreignKey: "invitedId", as: "Invited" });

UserProfile.hasMany(Tokens, { foreignKey: "userId", as: "tokens", onDelete: "CASCADE" });
Tokens.belongsTo(UserProfile, { foreignKey: "userId", as: "user" });

export {
    UserProfile,
    Invites,
    Friendships,
    Tokens,
};
