const { Leagues, LeagueMembers } = require("../models");

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

exports.createLeagueMember = async (userId, leagueId, coins) => {
    try {
        const leagueMember = await LeagueMembers.create({
            userId: userId,
            leagueId: leagueId,
            coins: coins,
            score: 0,
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
