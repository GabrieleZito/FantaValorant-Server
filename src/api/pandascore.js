import axios from "axios";
const api = axios.create({
    baseURL: "https://api.pandascore.co/valorant",
    headers: {
        Authorization: "Bearer " + process.env.PANDASCORE_API,
    },
});

export const getValorantTournaments = async () => {
    const res = await api.get("/tournaments");
    return res.data;
};

export const getPastValorantTournaments = async () => {
    const res = await api.get("/tournaments/past");
    return res.data;
};

export const getRunningValorantTournaments = async () => {
    const res = await api.get("/tournaments/running");
    return res.data;
};

export const getUpcomingValorantTournaments = async () => {
    const res = await api.get("/tournaments/upcoming");
    return res.data;
};

export const getTeamsPS = async (page = 1, per_page = 100) => {
    const res = await api.get("/teams", {
        params: {
            page: page,
            per_page: per_page,
        },
    });
    return res.data;
};

export const getSeries = async () => {
    const res = await api.get("/series");
    return res.data;
};

export const getPastSeries = async () => {
    const res = await api.get("/series/past");
    return res.data;
};

export const getRunningSeries = async () => {
    const res = await api.get("/series/running");
    return res.data;
};

export const getUpcomingSeries = async () => {
    const res = await api.get("/series/upcoming");
    return res.data;
};

export const getPlayers = async () => {
    const res = await api.get("/series/upcoming");
    return res.data;
};

export const getMatches = async () => {
    const res = await api.get("/matches");
    return res.data;
};

export const getPastMatches = async () => {
    const res = await api.get("/matches/past");
    return res.data;
};

export const getRunningMatches = async () => {
    const res = await api.get("/matches/runnning");
    return res.data;
};

export const getUpcomingMatches = async () => {
    const res = await api.get("/matches/upcoming");
    return res.data;
};

export const getLeagues = async () => {
    const res = await api.get("/leagues");
    return res.data;
};
