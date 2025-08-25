const Placements = require("../models/placements");
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
