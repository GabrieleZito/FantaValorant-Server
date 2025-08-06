const Friendships = require("./friendships");
const Tokens = require("./tokens");
const UserProfile = require("./userProfile");

UserProfile.hasMany(Friendships, { foreignKey: "requesterId", as: "SentRequests" });
UserProfile.hasMany(Friendships, { foreignKey: "addresseeId", as: "ReceivedRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "requesterId", as: "Requester" });
Friendships.belongsTo(UserProfile, { foreignKey: "addresseeId", as: "Addressee" });

UserProfile.hasMany(Tokens, { foreignKey: "userId", as: "tokens" });
Tokens.belongsTo(UserProfile, { foreignKey: "userId", as: "user" });

module.exports = {
    UserProfile,
    Friendships,
    Tokens,
};
