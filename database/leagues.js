const {
    Leagues,
    LeagueMembers,
    UserProfile,
    UserTeams,
    LeagueTournaments,
    Placements,
    ValorantTeams,
    Players,
    Auctions,
    AuctionPlayers,
} = require("../models");
const Tournaments = require("../models/liquipedia/tournaments");

exports.createLeague = async (data, userId) => {
    try {
        const league = await Leagues.create({
            name: data.name,
            fee: data.participationFee,
            coins: data.coinsPerUser,
            isPublic: data.isPublic,
            createdBy: userId,
        });
        return league;
    } catch (error) {
        console.error("Error in createLeague: " + error);
        throw error;
    }
};

exports.createLeagueMember = async (userId, leagueId, coins, teamId) => {
    try {
        const leagueMember = await LeagueMembers.create({
            userId: userId,
            leagueId: leagueId,
            coins: coins,
            score: 0,
            teamId: teamId,
        });
        return leagueMember;
    } catch (error) {
        console.error("Error in createLeagueMember: " + error);
        throw error;
    }
};

exports.findLeagueByName = async (name) => {
    try {
        const league = await Leagues.findOne({
            where: {
                name: name,
            },
        });
        return league;
    } catch (error) {
        console.error("Error in findLeagueByName: " + error);
        throw error;
    }
};

exports.checkLeagueDuplicatePerUser = async (name, userId) => {
    try {
        const league = await Leagues.findOne({
            where: {
                name: name,
                createdBy: userId,
            },
        });
        return league;
    } catch (error) {
        console.error("Error in checkLeagueDuplicatePerUser: " + error);
        throw error;
    }
};

exports.checkLeagueDuplicate = async (name, isPublic, userId) => {
    try {
        if (isPublic) {
            const existingLeague = await Leagues.findOne({
                where: {
                    name: name,
                    isPublic: isPublic,
                },
            });
            return existingLeague;
        } else {
            const existingLeague = await Leagues.findOne({
                where: {
                    name: name,
                    isPublic: isPublic,
                    createdBy: userId,
                },
            });
            return existingLeague;
        }
    } catch (error) {
        console.error("Error in checkLeagueDuplicate: " + error);
        throw error;
    }
};

exports.getJoinedLeagues = async (userId) => {
    try {
        const user = await UserProfile.findByPk(userId, {
            include: {
                model: Leagues,
                as: "JoinedLeagues",
            },
        });
        return user.JoinedLeagues;
    } catch (error) {
        console.error("Error in getJoinedLeagues: ", error);
        throw error;
    }
};

exports.createUserTeam = async (teamname) => {
    try {
        const userTeam = await UserTeams.create({
            name: teamname,
        });
        return userTeam;
    } catch (error) {
        console.error("Error in createUserTeam: ", error);
        throw error;
    }
};

exports.getUserTeam = async (userId) => {
    try {
        const team = await LeagueMembers.findByPk(userId, {
            include: {
                model: UserTeams,
            },
        });
        return team;
    } catch (error) {
        console.log("Error in getUserTeam: ", error);
        throw error;
    }
};

exports.createLeagueTournaments = async (leagueId, tournamentId) => {
    try {
        const LT = await LeagueTournaments.create({
            leagueId: leagueId,
            tournamentId: tournamentId,
        });
        return LT;
    } catch (error) {
        console.log("Error in createLeagueTournaments: ", error);
        throw error;
    }
};

exports.createAuction = async (leagueId) => {
    try {
        const auction = await Auctions.create({ leagueId: leagueId });
        return auction;
    } catch (error) {
        console.log("Error in createAuction: ", error);
        throw error;
    }
};

exports.addPlayersToAuction = async (leagueId, auctionId) => {
    try {
        const teams = new Set();
        const LT = await LeagueTournaments.findAll({ where: { leagueId: leagueId } });
        const placements = await Promise.all(
            LT.map(async (lt) => {
                const tournaments = await Tournaments.findByPk(lt.tournamentId, {
                    include: {
                        model: Placements,
                        as: "Placements",
                    },
                });
                tournaments.Placements.map((p) => {
                    if (p.opponenttype == "team" && p.opponentname !== "TBD") {
                        teams.add(p.opponentname);
                    }
                });
                return tournaments.Placements;
            })
        );
        const result = [];
        for (const team of teams) {
            //console.log(team);
            const x = await ValorantTeams.findOne({
                where: { name: team },
                include: { model: Players, as: "Players", where: { status: "Active", type: "player" } },
            });
            if (x) result.push(...x.Players);
        }
        await Promise.all(
            result.map(async (r) => {
                await AuctionPlayers.create({ auctionId: auctionId, playerId: r.id });
            })
        );
        const y = await Auctions.findByPk(auctionId, {
            include: {
                model: Players,
                as: "Auction Items",
            },
        });
        return y;
    } catch (error) {
        console.log("Error in addPlayersToAuction: ", error);
        throw error;
    }
};
