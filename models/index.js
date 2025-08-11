const Friendships = require("./friendships");
const LeagueMembers = require("./leagueMembers");
const Leagues = require("./leagues");
const Tokens = require("./tokens");
const UserProfile = require("./userProfile");

UserProfile.hasMany(Friendships, { foreignKey: "senderId", as: "SentRequests" });
UserProfile.hasMany(Friendships, { foreignKey: "receiverId", as: "ReceivedRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "senderId", as: "Sender" });
Friendships.belongsTo(UserProfile, { foreignKey: "receiverId", as: "Receiver" });

UserProfile.hasMany(Tokens, { foreignKey: "userId", as: "tokens" });
Tokens.belongsTo(UserProfile, { foreignKey: "userId", as: "user" });

UserProfile.hasMany(Leagues, { foreignKey: "createdBy", as: "CreatedLeagues" });
Leagues.belongsTo(UserProfile, { foreignKey: "createdBy", as: "Creator" });

UserProfile.belongsToMany(Leagues, { through: LeagueMembers, as: "JoinedLeagues", foreignKey: "userId", otherKey: "leagueId" });
Leagues.belongsToMany(UserProfile, { through: LeagueMembers, as: "Members", foreignKey: "leagueId", otherKey: "userId" });

module.exports = {
    UserProfile,
    Friendships,
    Tokens,
    Leagues,
    LeagueMembers,
};
