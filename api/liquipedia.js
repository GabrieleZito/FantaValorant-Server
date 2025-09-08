const axios = require("axios");

const axiosConf = axios.create({
    baseURL: "https://api.liquipedia.net/api/v3",
    headers: {
        Authorization: `Apikey ${process.env.LIQUIPEDIA_API}`,
    },
});

exports.getBroadcasters = async (game) => {
    try {
        const response = await axiosConf.get(`/broadcasters?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getBroadcasters: ", error);
        throw error;
    }
};

exports.getCompanies = async (game) => {
    try {
        const response = await axiosConf.get(`/company?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getCompanies: ", error);
        throw error;
    }
};

exports.getDatapoints = async (game) => {
    try {
        const response = await axiosConf.get(`/datapoint?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getDatapoints: ", error);
    }
};

exports.getExternalMediaLink = async (game) => {
    try {
        const response = await axiosConf.get(`/externalmedialink?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getExternalMediaLink: ", error);
        throw error;
    }
};

exports.getFinishedSeries = async (game, limit = 1000) => {
    try {
        const date = new Date();
        const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const response = await axiosConf.get(`/match`, {
            params: {
                wiki: game,
                limit: limit,
                conditions: `([[date::${today}]] OR [[date::>${today}]]) AND [[finished::1]] AND [[liquipediatiertype::!Showmatch]]`,
            },
        });
        return response.data.result;
    } catch (error) {
        //console.error("Error in getMatches: ", error);
        throw error;
    }
};

exports.getQuarterlyPlacements = async (game, limit = 1000, offset = 0, startdate, endDate) => {
    try {
        startdate = `${startdate.getFullYear()}-${(startdate.getMonth() + 1).toString().padStart(2, "0")}-${startdate
            .getDate()
            .toString()
            .padStart(2, "0")}`;
        endDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;
        const response = await axiosConf.get(`/placement`, {
            params: {
                wiki: game,
                limit: limit,
                offset: offset,
                conditions: `[[startdate::>${startdate}]] AND [[startdate::<${endDate}]]`,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getQuarterlyPlacements: ", error);
        throw error;
    }
};

exports.getTodayPlacements = async (game, limit = 1000, offset = 0) => {
    try {
        const date = new Date();
        const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const response = await axiosConf.get(`/placement`, {
            params: {
                wiki: game,
                limit: limit,
                offset: offset,
                conditions: `[[date::${today}]]`,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getTodayPlacements: ", error);
        throw error;
    }
};

//GET all players
exports.getPlayers = async (game, limit = 1000, offset = 0) => {
    try {
        const response = await axiosConf.get(`/player`, {
            params: {
                wiki: game,
                limit: limit,
                offset: offset,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getPlayers: ", error);
        throw error;
    }
};

//GET player by name
exports.getPlayer = async (game, name) => {
    try {
        //console.log(`QUERY:    /player?wiki=${game}&[[pagename::${name}]]`);
        const response = await axiosConf.get(`/player?wiki=${game}&[[pagename::${name}]]&t=${Date.now()}`);

        return response.data.result;
    } catch (error) {
        console.error("Error in getPlayers: ", error);
        throw error;
    }
};

exports.getSeries = async (game) => {
    try {
        const response = await axiosConf.get(`/series?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getSeries: ", error);
        throw error;
    }
};

exports.getSquadPlayers = async (game) => {
    try {
        const response = await axiosConf.get(`/squadplayer?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getSquadPlayers: ", error);
        throw error;
    }
};

exports.getStandingsEntries = async (game) => {
    try {
        const response = await axiosConf.get(`/standingsentry?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getStandingsEntries: ", error);
        throw error;
    }
};

exports.getStandingsTables = async (game) => {
    try {
        const response = await axiosConf.get(`/standingstable?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getStandingsTables: ", error);
        throw error;
    }
};

exports.getTeams = async (game, limit = 1000, offset = 0) => {
    try {
        const response = await axiosConf.get(`/team`, {
            params: {
                wiki: game,
                limit: limit,
                offset: offset,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getTeams: ", error);
        throw error;
    }
};

exports.getTeamByName = async (game, name, limit = 1000) => {
    try {
        const response = await axiosConf.get(`/team`, {
            params: {
                wiki: game,
                limit: limit,
                conditions: `[[name::${name}]]`,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getTeamByPagename: ", error);
        throw error;
    }
};

exports.getTournaments = async (game, limit = 1000, offset = 0) => {
    try {
        const date = new Date();
        const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const response = await axiosConf.get(`/tournament`, {
            params: {
                wiki: game,
                limit: limit,
                offset: offset,
                //conditions: `[[startdate::>${today}]] OR [[startdate::${today}]]`,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getTournaments: ", error);
        throw error;
    }
};

exports.getTransfers = async (game) => {
    try {
        const response = await axiosConf.get(`/transfer?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getTransfers: ", error);
        throw error;
    }
};

exports.getTeamTemplate = async (game, template) => {
    try {
        const response = await axiosConf.get(`/teamtemplate?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getTeamTemplate: ", error);
        throw error;
    }
};

exports.getTeamTemplateList = async (game, template) => {
    try {
        const response = await axiosConf.get(`/teamtemplatelist?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getTeamTemplateList: ", error);
        throw error;
    }
};

exports.getCurrentVCTTournaments = async (game, limit = 1000) => {
    try {
        const date = new Date();
        const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const endOfYear = `${date.getFullYear()}-12-31`;
        const parameters = [
            `wiki=${game}`,
            `limit=${limit}`,
            `conditions=[[startdate::>${today}]]+AND+[[seriespage::VALORANT_Champions_Tour]]+AND+[[startdate::<${endOfYear}]]`,
        ];
        const response = await axiosConf.get(`/tournament?${parameters.join("&")}`);
        return response.data.result;
    } catch (error) {
        //console.error("Error in getCurrentTournaments: ", error);
        throw error;
    }
};
