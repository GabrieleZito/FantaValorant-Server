const Friendships = require("./friendships");
const Tokens = require("./tokens");
const UserProfile = require("./userProfile");

UserProfile.hasMany(Friendships, { foreignKey: "senderId", as: "SentRequests" });
UserProfile.hasMany(Friendships, { foreignKey: "receiverId", as: "ReceivedRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "senderId", as: "Sender" });
Friendships.belongsTo(UserProfile, { foreignKey: "receiverId", as: "Receiver" });

UserProfile.hasMany(Tokens, { foreignKey: "userId", as: "tokens" });
Tokens.belongsTo(UserProfile, { foreignKey: "userId", as: "user" });

module.exports = {
    UserProfile,
    Friendships,
    Tokens,
};
