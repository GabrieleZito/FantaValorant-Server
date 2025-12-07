const {
    Leagues,
    LeagueMembers,
    UserProfile,
    UserTeams,
    Auctions,
    AuctionPlayers,
} = require("../models");

exports.createLeague = async (data, userId) => {
    try {
        const league = await Leagues.create({
            name: data.name,
            fee: data.participationFee,
            coins: data.coinsPerUser,
            isPublic: data.isPublic,
            tournamentName: data.tournament,
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

exports.addTeamToLeagueMember = async (userId, leagueId, teamId) => {
    try {
        const lm = await LeagueMembers.findOne({
            where: {
                userId: userId,
                leagueId: leagueId,
            },
        });
        lm.update({ teamId: teamId });
        return lm;
    } catch (error) {
        console.error("Error in addTeamToLeagueMember: ", error);
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

exports.createAuction = async (leagueId) => {
    try {
        const [auction, created] = await Auctions.findOrCreate({ where: { leagueId: leagueId } });
        return auction;
    } catch (error) {
        console.log("Error in createAuction: ", error);
        throw error;
    }
};

exports.getLeagueById = async (leagueId) => {
    try {
        const league = await Leagues.findByPk(leagueId);
        return league;
    } catch (error) {
        console.log("Error in getLeagueById: ", error);
        throw error;
    }
};

exports.getLeagueByName = async (name, isPublic) => {
    try {
        const league = await Leagues.findOne({
            where: { name: name, isPublic: isPublic },
            include: [
                {
                    model: UserProfile,
                    as: "Members",
                    attributes: ["id", "propic", "username"],
                    through: {
                        attributes: ["coins", "score", "teamId"],
                    },
                },
                {
                    model: Auctions,
                    as: "Auction",
                },
            ],
        });
        await Promise.all(
            league.Members.map(async (m) => {
                const lm = await LeagueMembers.findOne({
                    where: {
                        leagueId: league.id,
                        userId: m.id,
                    },
                    include: {
                        model: UserTeams,
                    },
                });
                m.dataValues.Team = lm.UserTeam;
                //console.log(m.dataValues);
            })
        );
        return league;
    } catch (error) {
        console.log("Error in getLeagueByName: ", error);
        throw error;
    }
};

exports.getAuctionById = async (auctionId) => {
    try {
        const auction = await Auctions.findByPk(auctionId);
        return auction;
    } catch (error) {
        console.error("Error in getAuctionById: ", error);
        throw error;
    }
};


