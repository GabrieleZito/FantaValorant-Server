const { Op } = require("sequelize");
const { ValorantTeams, Matches, PlayerTeamMatches, MatchSeries } = require("../models");
const Placements = require("../models/liquipedia/placements");
const Players = require("../models/liquipedia/players");
const Tournaments = require("../models/liquipedia/tournaments");
const sequelize = require("../config/sequelize");

exports.createTournament = async (tournament) => {
    try {
        const ntournament = await Tournaments.create(tournament);
        return ntournament;
    } catch (error) {
        console.error("Error in createTournament: ", error);
        throw error;
    }
};

exports.getTournamentByPagename = async (pagename) => {
    try {
        const tournament = await Tournaments.findOne({
            where: {
                pagename: pagename,
            },
        });
        return tournament;
    } catch (error) {
        console.error("Error in getTournamentByPagename: ", error);
        throw error;
    }
};

exports.getTournamentByName = async (name) => {
    try {
        const tournament = await Tournaments.findOne({
            where: {
                name: name,
            },
        });
        return tournament;
    } catch (error) {
        console.error("Error in getTournamentByName: ", error);
        throw error;
    }
};

exports.updateTournament = async (oldT, newT) => {
    try {
        const updated = await oldT.update(newT);
        return updated;
    } catch (error) {
        console.error("Error in updateTournament: ", error);
        throw error;
    }
};

exports.getPlacementByPagename = async (pagename) => {
    try {
        const placement = await Placements.findOne({
            where: {
                pagename: pagename,
            },
        });
        return placement;
    } catch (error) {
        console.error("Error in getPlacementByPagename: ", error);
        throw error;
    }
};

exports.deleteTodayPlacements = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    try {
        console.log(`Deleting placements from ${today} to ${tomorrow}`);
        const placements = await Placements.destroy({
            where: {
                date: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow,
                },
            },
        });
        return placements;
    } catch (error) {
        console.error("Error in deleteTodayPlacements: ", error);
        throw error;
    }
};

exports.createPlacement = async (placement) => {
    try {
        const nPlacement = Placements.create(placement);
        return nPlacement;
    } catch (error) {
        console.error("Error in createPlacement");
        throw error;
    }
};

exports.updatePlacement = async (oldP, newP) => {
    try {
        const updated = await oldP.update(newP);
        return updated;
    } catch (error) {
        console.error("Error in updatePlacement: ", error);
        throw error;
    }
};

exports.getTeamByPagename = async (pagename) => {
    try {
        const team = await ValorantTeams.findOne({
            where: {
                pagename: pagename,
            },
        });
        return team;
    } catch (error) {
        console.error("Error in getTeamByPagename: ", error);
        throw error;
    }
};

exports.createValorantTeam = async (team) => {
    try {
        const newteam = await ValorantTeams.create(team);
        return newteam;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            console.log(`Team ${team.pagename} already in db`);
        } else {
            console.log("Error in getOrCreateTeam: ", error);
        }
        throw error;
    }
};

exports.findOrCreateValorantTeam = async (team) => {
    try {
        const newP = await ValorantTeams.findOrCreate({
            where: { name: { [Op.iLike]: `%${team.name}%` } },
            defaults: team,
        });
        return newP;
    } catch (error) {
        console.log("Error in findOrCreateValorantTeam for team" + team.name + ": ", error);
        throw error;
    }
};

exports.updateValorantTeam = async (oldT, newT) => {
    try {
        const updated = await oldT.update(newT);
        return updated;
    } catch (error) {
        console.error("Error in updateValorantTeam: ", error);
        throw error;
    }
};

exports.getMatchSeriesByObjectname = async (objectname) => {
    try {
        const match = await MatchSeries.findOne({
            where: {
                objectname: objectname,
            },
            include: {
                model: Matches,
                as: "Matches",
                include: {
                    model: PlayerTeamMatches,
                    include: [{ model: ValorantTeams }, { model: Players }],
                },
            },
        });
        return match;
    } catch (error) {
        console.error("Error in getMatchByObjectname: ", error);
        throw error;
    }
};

exports.createMatchSeries = async (m) => {
    try {
        const matchseries = await MatchSeries.create(m);
        return matchseries;
    } catch (error) {
        console.error("Error in createMatchSeries: ", error);
        throw error;
    }
};

exports.getValorantTeamByName = async (name) => {
    try {
        const valorantTeam = await ValorantTeams.findOne({
            where: {
                name: name,
            },
        });
        return valorantTeam;
    } catch (error) {
        console.error("Error in getValorantTeamByName: ", error);
        throw error;
    }
};

exports.getPlayerByName = async (name) => {
    try {
        const player = await Players.findOne({
            where: {
                name: name,
            },
        });
        return player;
    } catch (error) {
        console.error("Error in getPlayerByName: ", error);
        throw error;
    }
};

exports.getPlayerByPagename = async (pagename) => {
    try {
        const player = await Players.findOne({
            where: {
                pagename: pagename,
            },
        });
        return player;
    } catch (error) {
        console.error("Error in getPlayerByPagename: ", error);
        throw error;
    }
};

exports.createPlayer = async (player) => {
    try {
        const newP = await Players.create({
            pageid: player.pageid,
            pagename: player.pagename,
            namespace: player.namespace,
            objectname: player.objectname,
            liquipediaid: player.id,
            alternateid: player.alternateid,
            name: player.name,
            localizedname: player.localizedname,
            type: player.type,
            nationality: player.nationality,
            nationality2: player.nationality2,
            nationality3: player.nationality3,
            region: player.region,
            birthdate: player.birthdate,
            deathdate: player.deathdate,
            teampagename: player.teampagename,
            teamtemplate: player.teamtemplate,
            links: player.links,
            status: player.status,
            earnings: player.earnings,
            earningsbyyear: player.earningsbyyear,
            extradata: player.extradata,
        });
        return newP;
    } catch (error) {
        console.log("Error in createPlayer: ", error);
        throw error;
    }
};

exports.updatePlayer = async (oldP, newP) => {
    try {
        const updated = await oldP.update({
            pageid: newP.pageid,
            pagename: newP.pagename,
            namespace: newP.namespace,
            objectname: newP.objectname,
            liquipediaid: newP.id,
            alternateid: newP.alternateid,
            name: newP.name,
            localizedname: newP.localizedname,
            type: newP.type,
            nationality: newP.nationality,
            nationality2: newP.nationality2,
            nationality3: newP.nationality3,
            region: newP.region,
            birthdate: newP.birthdate,
            deathdate: newP.deathdate,
            teampagename: newP.teampagename,
            teamtemplate: newP.teamtemplate,
            links: newP.links,
            status: newP.status,
            earnings: newP.earnings,
            earningsbyyear: newP.earningsbyyear,
            extradata: newP.extradata,
        });
        return updated;
    } catch (error) {
        console.error("Error in updatePlayer: ", error);
        throw error;
    }
};

exports.findOrCreatePlayer = async (player) => {
    try {
        const newP = await Players.findOrCreate({
            where: { pagename: player.name },
            defaults: {
                pagename: player.name,
                nationality: player.flag,
                extradata: player.extradata,
            },
        });
        return newP;
    } catch (error) {
        console.log("Error in findOrCreatePlayer: ", error);
        throw error;
    }
};

exports.createMatch = async (m) => {
    try {
        const newM = await Matches.create(m);
        return newM;
    } catch (error) {
        console.error("Error in createMatch: ", error);
        throw error;
    }
};

exports.createPlayerTeamMatch = async (ptm) => {
    try {
        const newPTM = await PlayerTeamMatches.create(ptm);
        return newPTM;
    } catch (error) {
        console.error("Error in createPlayerTeamMatch: ", error);
        throw error;
    }
};

exports.getDuplicateTournaments = async () => {
    try {
        const duplicateRows = await Tournaments.findAll({
            where: {
                pagename: {
                    [Op.in]: sequelize.literal(`(
                        SELECT "pagename" 
                        FROM "${Tournaments.tableName}" 
                        GROUP BY "pagename" 
                        HAVING COUNT(*) > 1
                    )`),
                },
            },
        });
        return duplicateRows;
    } catch (error) {
        console.error("Error in getDuplicateTournaments: ", error);
        throw error;
    }
};

exports.getNextTournaments = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tournaments = await Tournaments.findAll({
            where: {
                enddate: {
                    [Op.gte]: today,
                },
            },
            group: "seriespage",
        });
        return tournaments
    } catch (error) {
        console.error("Error in getNextTournaments: ", error);
        throw error;
    }
};
