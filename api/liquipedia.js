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

exports.getMatches = async (game, limit = 1000) => {
    try {
        const date = new Date();
        const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const parameters = [`wiki=${game}`, `limit=${limit}`, `conditions=[[startdate::>${today}]]`];
        const response = await axiosConf.get(`/match?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getMatches: ", error);
        throw error;
    }
};

exports.getPlacements = async (game, limit = 1000) => {
    try {
        const date = new Date();
        const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const parameters = [`wiki=${game}`, `limit=${limit}`, `conditions=[[startdate::>${today}]]`];
        const response = await axiosConf.get(`/placement?${parameters.join("&")}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getplacement: ", error);
        throw error;
    }
};

exports.getPlayers = async (game) => {
    try {
        const response = await axiosConf.get(`/player?wiki=${game}`);
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

exports.getTeams = async (game) => {
    try {
        const response = await axiosConf.get(`/team?wiki=${game}`);
        return response.data.result;
    } catch (error) {
        console.error("Error in getTeams: ", error);
        throw error;
    }
};

exports.getTournaments = async (game, limit = 1000) => {
    try {
        const date = new Date();
        const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const parameters = [`wiki=${game}`, `limit=${limit}`, `conditions=[[startdate::>${today}]]`];

        const response = await axiosConf.get(`/tournament?${parameters.join("&")}`);
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
