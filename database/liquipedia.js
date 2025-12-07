const { Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const LPPlayers = require("../models/liquipedia/lpplayers");
const LPTeams = require("../models/liquipedia/lpteams");
const LPMatches = require("../models/liquipedia/lpmatches");
const LPSeries = require("../models/liquipedia/lpseries");

exports.createRawPlayer = async (data) => {
    try {
        const player = await LPPlayers.create({
            pageid: data.pageid,
            namespace: data.namespace,
            pagename: data.pagename,
            wiki: data.wiki,
            raw: data,
        });
        return player;
    } catch (error) {
        console.error("Error in createRawPlayer: ", error);
        throw error;
    }
};

exports.createRawTeam = async (data) => {
    try {
        const team = await LPTeams.create({
            pageid: data.pageid,
            namespace: data.namespace,
            pagename: data.pagename,
            wiki: data.wiki,
            raw: data,
        });
        return team;
    } catch (error) {
        console.error("Error in createRawTeam: ", error);
        throw error;
    }
};

exports.createRawMatch = async (data) => {
    try {
        const match = await LPMatches.create({
            pageid: data.pageid,
            namespace: data.namespace,
            pagename: data.pagename,
            match2id: data.match2id,
            wiki: data.wiki,
            raw: data,
        });
        return match;
    } catch (error) {
        console.error("Error in createRawMatch: ", error);
        throw error;
    }
};

exports.createRawSeries = async (data) => {
    try {
        const series = await LPSeries.create({
            pageid: data.pageid,
            namespace: data.namespace,
            pagename: data.pagename,
            wiki: data.wiki,
            raw: data,
        });
        return series;
    } catch (error) {
        console.error("Error in createRawMatch: ", error);
        throw error;
    }
};