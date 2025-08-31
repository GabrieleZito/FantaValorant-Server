const { ValorantTeams, Matches, PlayerTeamMatches, MatchSeries } = require("../models");
const Placements = require("../models/placements");
const Players = require("../models/players");
const Tournaments = require("../models/tournaments");

exports.createTournament = async (tournament) => {
    try {
        const ntournament = await Tournaments.create({
            pagename: tournament.pagename,
            name: tournament.name,
            shortname: tournament.shortname,
            banner: tournament.banner,
            bannerurl: tournament.bannerurl,
            bannerdark: tournament.bannerdark,
            bannerdarkurl: tournament.bannerdarkurl,
            iconurl: tournament.iconurl,
            icondarkurl: tournament.icondarkurl,
            seriespage: tournament.seriespage,
            previous: tournament.previous,
            previous2: tournament.previous2,
            next: tournament.next,
            next2: tournament.next2,
            mode: tournament.mode,
            type: tournament.mode,
            startdate: tournament.startdate,
            enddate: tournament.enddate,
            maps: tournament.maps,
            liquipediatiertype: tournament.liquipediatiertype,
            status: tournament.status,
        });
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

exports.createPlacement = async (placement) => {
    try {
        const nPlacement = Placements.create({
            pagename: placement.pagename,
            objectname: placement.objectname,
            tournament: placement.tournament,
            series: placement.series,
            parent: placement.parent,
            placement: placement.placement,
            prizemoney: placement.prizemoney,
            mode: placement.mode,
            type: placement.type,
            liquipediatiertype: placement.liquipediatiertype,
            opponentname: placement.opponentname,
            opponenttemplate: placement.opponenttemplate,
            opponenttype: placement.opponenttype,
            qualifier: placement.qualifier,
            qualifierpage: placement.qualifierpage,
            tournamentId: placement.tournamentId,
        });
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
        const newteam = await ValorantTeams.create({
            pagename: team.pagename,
            objectname: team.objectname,
            name: team.name,
            region: team.region,
            logo: team.logo,
            logourl: team.logourl,
            logodark: team.logodark,
            logodarkurl: team.logodarkurl,
            createdate: team.createdate,
            earnings: team.earnings,
            template: team.template,
            status: team.status,
        });
        return newteam;
    } catch (error) {
        console.error("Error in createValorantTeam: ", error);
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

exports.createPlayer = async (player) => {
    try {
        const newP = await Players.create(player, {
            fields: [
                "pagename",
                "objectname",
                "alternateid",
                "name",
                "nationality",
                "nationality2",
                "nationality3",
                "region",
                "birthdate",
                "teampagename",
                "teamtemplate",
                "status",
                "earnings",
                "extradata",
            ],
        });
        return newP;
    } catch (error) {
        console.log("---------------------------------------");
        console.log("Player: ");
        console.log(player);
        console.log("---------------------------------------");
        console.error("Error in createPlayer: ", error);

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
