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

exports.getSeries = async (game, limit = 1000, offset = 0) => {
    try {
        const response = await axiosConf.get(`/series`, {
            params: {
                wiki: game,
                limit: limit,
                offset: offset,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getSeries: ", error);
        throw error;
    }
};

exports.getMatches = async (game, limit = 1000, offset = 0, params) => {
    try {
        const response = await axiosConf.get(`/match`, {
            params: {
                wiki: game,
                limit: limit,
                offset: offset,
                conditions: params.date_from && params.date_to ? `[[date::>${params.date_from}]] AND [[date::<${params.date_to}]]` : "",
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error in getMatches: ", error);
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

exports.getSquadPlayers = async (game, limit, offset) => {
    try {
        const response = await axiosConf.get("/squadplayer", {
            params: {
                wiki: game,
                conditions: `[[status::active]]`,
                limit: limit,
                offset: offset,
            },
        });
        return response.data.result;
    } catch (error) {
        throw error;
    }
};

exports.getSquadPlayersByTemplate = async (game, teamtemplate) => {
    try {
        const response = await axiosConf.get("/squadplayer", {
            params: {
                wiki: game,
                conditions: `[[teamtemplate::${teamtemplate}]] AND [[status::active]]`,
                limit: 1000,
            },
        });
        return response.data.result;
    } catch (error) {
        throw error;
    }
};
