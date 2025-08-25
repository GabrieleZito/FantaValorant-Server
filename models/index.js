const Friendships = require("./friendships");
const LeagueMembers = require("./leagueMembers");
const Leagues = require("./leagues");
const LeagueTournaments = require("./leagueTournaments");
const Matches = require("./matches");
const Placements = require("./placements");
const Players = require("./players");
const PlayerTeamMatches = require("./playerTeamMatches");
const Tokens = require("./tokens");
const Tournaments = require("./tournaments");
const UserProfile = require("./userProfile");
const ValorantTeams = require("./ValorantTeams");

UserProfile.hasMany(Friendships, { foreignKey: "senderId", as: "SentRequests" });
UserProfile.hasMany(Friendships, { foreignKey: "receiverId", as: "ReceivedRequests" });
Friendships.belongsTo(UserProfile, { foreignKey: "senderId", as: "Sender" });
Friendships.belongsTo(UserProfile, { foreignKey: "receiverId", as: "Receiver" });

UserProfile.hasMany(Tokens, { foreignKey: "userId", as: "tokens", onDelete: "CASCADE" });
Tokens.belongsTo(UserProfile, { foreignKey: "userId", as: "user" });

UserProfile.hasMany(Leagues, { foreignKey: "createdBy", as: "CreatedLeagues" });
Leagues.belongsTo(UserProfile, { foreignKey: "createdBy", as: "Creator" });

UserProfile.belongsToMany(Leagues, { through: LeagueMembers, as: "JoinedLeagues", foreignKey: "userId", otherKey: "leagueId" });
Leagues.belongsToMany(UserProfile, { through: LeagueMembers, as: "Members", foreignKey: "leagueId", otherKey: "userId" });

Leagues.belongsToMany(Tournaments, { through: LeagueTournaments, as: "Tournaments", otherKey: "tournamentId", foreignKey: "leagueId" });
Tournaments.belongsToMany(Leagues, { through: LeagueTournaments, as: "League", otherKey: "leagueId", foreignKey: "tournamentId" });

Tournaments.hasMany(Placements, { as: "Placements", foreignKey: "tournamentId" });
Placements.belongsTo(Tournaments, { as: "Tournament", foreignKey: "tournamentId" });

Tournaments.hasMany(Matches, { as: "Matches", foreignKey: "tournamentId" });
Matches.belongsTo(Tournaments, { as: "Tournament", foreignKey: "tournamentId" });

Matches.hasMany(PlayerTeamMatches, { foreignKey: "matchId" });
ValorantTeams.hasMany(PlayerTeamMatches, { foreignKey: "teamId" });
Players.hasMany(PlayerTeamMatches, { foreignKey: "playerId" });

PlayerTeamMatches.belongsTo(Matches, { foreignKey: "matchId" });
PlayerTeamMatches.belongsTo(ValorantTeams, { foreignKey: "teamId" });
PlayerTeamMatches.belongsTo(Players, { foreignKey: "playerId" });

module.exports = {
    UserProfile,
    Friendships,
    Tokens,
    Leagues,
    LeagueMembers,
    LeagueTournaments,
    ValorantTeams,
    Matches,
    Placements,
    PlayerTeamMatches,
};
