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
        let os = 83000;

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

exports.importMatchesWithDateRange = async (startDate, endDate) => {
    try {
        let os = 0;
        let totalFetched = 0;

        while (true) {
            const matches = await getMatches("valorant", 100, os, {
                date_from: startDate,
                date_to: endDate,
            });

            if (!matches || matches.length === 0) break;

            console.log(`Fetched ${matches.length} matches for period ${startDate} to ${endDate} (offset ${os})`);

            await Promise.all(matches.map(async (p) => await createRawMatch(p)));

            totalFetched += matches.length;

            if (matches.length < 100) break;

            os += 100;

            // Stop if we hit offset limit for this date range
            if (os >= 80000) {
                console.log(`Hit offset limit for date range. Fetched ${totalFetched} matches.`);
                break;
            }
        }

        return totalFetched;
    } catch (error) {
        console.error("Error fetching matches: ", error.request.res.statusMessage);
        return 0;
    }
};

exports.importAllMatchesByDateRanges = async () => {
    const dateRanges = [
        { start: "2019-01-01", end: "2019-12-31" },
        //{ start: "2020-01-01", end: "2021-12-31" },
        //{ start: "2022-01-01", end: "2022-12-31" },
        //{ start: "2023-01-01", end: "2023-12-31" },
        //{ start: "2024-01-01", end: "2024-12-31" },
        //{ start: "2025-01-01", end: "2025-01-31" },
        //{ start: "2025-02-01", end: "2025-02-28" },
        //{ start: "2025-03-01", end: "2025-03-31" },
        //{ start: "2025-04-01", end: "2025-04-30" },
        //{ start: "2025-05-01", end: "2025-05-31" },
        //{ start: "2025-06-01", end: "2025-06-30" },
        //{ start: "2025-07-01", end: "2025-07-31" },
        //{ start: "2025-08-01", end: "2025-08-31" },
        //{ start: "2025-09-01", end: "2025-09-30" },
        //{ start: "2025-10-01", end: "2025-10-31" },
        //{ start: "2025-11-01", end: "2025-11-30" },
        //{ start: "2025-12-01", end: "2025-12-31" },
        //{ start: "2026-01-01", end: "2026-12-31" },
    ];

    let grandTotal = 0;

    for (const range of dateRanges) {
        console.log(`\n=== Processing date range: ${range.start} to ${range.end} ===`);
        const count = await this.importMatchesWithDateRange(range.start, range.end);
        grandTotal += count;
        console.log(`Completed date range. Range total: ${count}, Grand total: ${grandTotal}`);
    }

    console.log(`\n=== Import Complete. Total matches: ${grandTotal} ===`);
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
