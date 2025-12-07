const { getPlayers, getTeams, getSeries, getMatches } = require("../../api/liquipedia");
const { createRawPlayer, createRawTeam, createRawMatch, createRawSeries } = require("../../database/liquipedia");

exports.importPlayersFromLiquipedia = async () => {
    try {
        let os = 0;

        let players = await getPlayers("valorant", 1000, os);
        console.log(`Fetched ${players.length} players (offset ${os})`);
        await Promise.all(
            players.map(async (p) => {
                await createRawPlayer(p);
            })
        );
        while (players.length > 999) {
            os += 1000;
            players = await getPlayers("valorant", 1000, os);
            console.log(`Fetched ${players.length} players (offset ${os})`);
            await Promise.all(
                players.map(async (p) => {
                    await createRawPlayer(p);
                })
            );
        }
    } catch (error) {
        console.error("Error fetching players: ", error);
    }
};

exports.importTeamsFromliquipedia = async () => {
    try {
        let os = 0;

        let teams = await getTeams("valorant", 1000, os);
        console.log(`Fetched ${teams.length} teams (offset ${os})`);
        await Promise.all(
            teams.map(async (p) => {
                await createRawTeam(p);
            })
        );
        while (teams.length > 999) {
            os += 1000;
            teams = await getTeams("valorant", 1000, os);
            console.log(`Fetched ${teams.length} teams (offset ${os})`);
            await Promise.all(
                teams.map(async (p) => {
                    await createRawTeam(p);
                })
            );
        }
    } catch (error) {
        console.error("Error fetching teams: ", error);
    }
};

exports.importMatchesFromliquipedia = async () => {
    try {
        let os = 0;

        let matches = await getMatches("valorant", 1000, os);
        console.log(`Fetched ${matches.length} matches (offset ${os})`);
        await Promise.all(
            matches.map(async (p) => {
                await createRawMatch(p);
            })
        );
        while (matches.length > 999) {
            os += 1000;
            matches = await getMatches("valorant", 1000, os);
            console.log(`Fetched ${matches.length} matches (offset ${os})`);
            await Promise.all(
                matches.map(async (p) => {
                    await createRawMatch(p);
                })
            );
        }
    } catch (error) {
        console.error("Error fetching matches: ", error);
    }
};

exports.importSeriesFromliquipedia = async () => {
    try {
        let os = 0;

        let series = await getSeries("valorant", 1000, os);
        console.log(`Fetched ${series.length} series (offset ${os})`);
        await Promise.all(
            series.map(async (p) => {
                await createRawSeries(p);
            })
        );
        while (series.length > 999) {
            os += 1000;
            series = await getSeries("valorant", 1000, os);
            console.log(`Fetched ${series.length} series (offset ${os})`);
            await Promise.all(
                series.map(async (p) => {
                    await createRawSeries(p);
                })
            );
        }
    } catch (error) {
        console.error("Error fetching series: ", error);
    }
};
