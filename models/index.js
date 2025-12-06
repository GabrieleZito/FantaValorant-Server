const Friendships = require("./friendships");
const LeagueMembers = require("./leagueMembers");
const Leagues = require("./leagues");
const Tokens = require("./tokens");
const UserProfile = require("./userProfile");
const UserTeams = require("./userTeams");
const Auctions = require("./auctions");
const AuctionPlayers = require("./auctionsPlayers");
const Invites = require("./invites");
const Bids = require("./bids");

UserProfile.hasMany(Friendships, { foreignKey: "senderId", as: "SentRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "senderId", as: "Sender" });
UserProfile.hasMany(Friendships, { foreignKey: "receiverId", as: "ReceivedRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "receiverId", as: "Receiver" });

UserProfile.hasMany(Invites, { foreignKey: "senderId", as: "SentInvites" });
Invites.belongsTo(UserProfile, { foreignKey: "senderId", as: "Sender" });
UserProfile.hasMany(Invites, { foreignKey: "invitedId", as: "ReceivedInvites" });
Invites.belongsTo(UserProfile, { foreignKey: "invitedId", as: "Invited" });

Leagues.hasMany(Invites, { foreignKey: "leagueId" });
Invites.belongsTo(Leagues, { foreignKey: "leagueId" });

UserProfile.hasMany(Tokens, { foreignKey: "userId", as: "tokens", onDelete: "CASCADE" });
Tokens.belongsTo(UserProfile, { foreignKey: "userId", as: "user" });

UserProfile.hasMany(Leagues, { foreignKey: "createdBy", as: "CreatedLeagues" });
Leagues.belongsTo(UserProfile, { foreignKey: "createdBy", as: "Creator" });

UserProfile.belongsToMany(Leagues, { through: LeagueMembers, as: "JoinedLeagues", foreignKey: "userId", otherKey: "leagueId" });
Leagues.belongsToMany(UserProfile, { through: LeagueMembers, as: "Members", foreignKey: "leagueId", otherKey: "userId" });

LeagueMembers.belongsTo(UserTeams, { foreignKey: "teamId" });
UserTeams.hasMany(LeagueMembers, { foreignKey: "teamId" });

UserProfile.hasMany(Bids, { as: "Bids", foreignKey: "userId" });
Bids.belongsTo(UserProfile, { as: "Bidder", foreignKey: "userId" });

Auctions.hasMany(Bids, { as: "Bids", foreignKey: "auctionId" });
Bids.belongsTo(Auctions, { as: "Auction", foreignKey: "auctionId" });

module.exports = {
    UserProfile,
    Friendships,
    Tokens,
    Leagues,
    LeagueMembers,
    UserTeams,
    Auctions,
    AuctionPlayers,
    Invites,
    Bids,
};
