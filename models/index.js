const Friendships = require("./friendships");
const LeagueMembers = require("./leagueMembers");
const Leagues = require("./leagues");
const LeagueTournaments = require("./leagueTournaments");
const Matches = require("./liquipedia/matches");
const MatchSeries = require("./liquipedia/matchseries");
const Placements = require("./liquipedia/placements");
const Players = require("./liquipedia/players");
const PlayerTeamMatches = require("./liquipedia/playerTeamMatches");
const Tokens = require("./tokens");
const Tournaments = require("./liquipedia/tournaments");
const UserProfile = require("./userProfile");
const ValorantTeams = require("./liquipedia/ValorantTeams");
const UserTeams = require("./userTeams");
const Auctions = require("./auctions");
const AuctionPlayers = require("./auctionsPlayers");

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

LeagueMembers.belongsTo(UserTeams, { foreignKey: "teamId" });
UserTeams.hasMany(LeagueMembers, { foreignKey: "teamId" });

Leagues.belongsToMany(Tournaments, { through: LeagueTournaments, as: "Tournaments", otherKey: "tournamentId", foreignKey: "leagueId" });
Tournaments.belongsToMany(Leagues, { through: LeagueTournaments, as: "League", otherKey: "leagueId", foreignKey: "tournamentId" });

Tournaments.hasMany(Placements, { as: "Placements", foreignKey: "tournamentId" });
Placements.belongsTo(Tournaments, { as: "Tournament", foreignKey: "tournamentId" });

Tournaments.hasMany(MatchSeries, { as: "MatchSeries", foreignKey: "tournamentId" });
MatchSeries.belongsTo(Tournaments, { as: "Tournament", foreignKey: "tournamentId" });

MatchSeries.hasMany(Matches, { as: "Matches", foreignKey: "matchSeriesId" });
Matches.belongsTo(MatchSeries, { as: "Series", foreignKey: "matchSeriesId" });

Matches.hasMany(PlayerTeamMatches, { foreignKey: "matchId" });
ValorantTeams.hasMany(PlayerTeamMatches, { foreignKey: "teamId" });
Players.hasMany(PlayerTeamMatches, { foreignKey: "playerId" });

PlayerTeamMatches.belongsTo(Matches, { foreignKey: "matchId" });
PlayerTeamMatches.belongsTo(ValorantTeams, { foreignKey: "teamId" });
PlayerTeamMatches.belongsTo(Players, { foreignKey: "playerId" });

ValorantTeams.hasMany(MatchSeries, { as: "SeriesWon", foreignKey: "winner" });
MatchSeries.belongsTo(ValorantTeams, { as: "Winner", foreignKey: "winner" });

ValorantTeams.hasMany(Matches, { as: "MatchesWon", foreignKey: "winner" });
Matches.belongsTo(ValorantTeams, { as: "Winner", foreignKey: "winner" });

ValorantTeams.hasMany(Players, { as: "Players", foreignKey: "teamId" });
Players.belongsTo(ValorantTeams, { as: "Team", foreignKey: "teamId" });

Auctions.belongsToMany(Players, { through: AuctionPlayers, as: "Auction Items", foreignKey: "auctionId", otherKey: "playerId" });
Players.belongsToMany(Auctions, { through: AuctionPlayers, as: "Listed in", foreignKey: "playerId", otherKey: "auctionId" });

Leagues.hasOne(Auctions, { foreignKey: "leagueId" });
Auctions.belongsTo(Leagues);

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
    MatchSeries,
    Players,
    Tournaments,
    UserTeams,
    Auctions,
    AuctionPlayers,
};
