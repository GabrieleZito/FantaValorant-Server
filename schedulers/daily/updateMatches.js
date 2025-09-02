const cron = require("node-cron");
const { getTeam, getPlayer, getFinishedSeries } = require("../../api/liquipedia");
const {
    getMatchSeriesByObjectname,
    createMatchSeries,
    getValorantTeamByName,
    createValorantTeam,
    getPlayerByName,
    createPlayer,
    createMatch,
    createPlayerTeamMatch,
} = require("../../database/liquipedia");
const { MatchSeries, Matches, PlayerTeamMatches } = require("../../models");

cron.schedule("30 0 23 * * *", updateMatches);

async function updateMatches() {
    const data = require("../../series.json");
    console.log("Updating matches");
    try {
        // get all the future match series
        const series = data.result; //await getFinishedSeries("valorant");
        console.log("series length: ", series.length);
        const result = await Promise.all(
            series.map(async (s) => {
                let team1, team2;
                if (s.match2opponents) {
                    team1 = await getOrCreateTeam(s.match2opponents[0].name);
                    team2 = await getOrCreateTeam(s.match2opponents[1].name);
                }

                //get the winning team
                s.winner = parseInt(s.winner);
                if (s.match2opponents) {
                    if (s.match2opponents[0].id == s.winner) {
                        s.winner = team1.id;
                    } else if (s.match2opponents[1].id == s.winner) {
                        s.winner = team2.id;
                    }
                }
                const series = await createMatchSeries(s);

                const result1 = await Promise.all(
                    s.match2games.map(async (m) => {
                        m.winner = m.winner == "1" ? team1.id : team2.id;
                        m.matchSeriesId = series.id;
                        //console.log("series id: ", series.id);
                        //console.log("m.matchseriesID: ", m.matchSeriesId);
                        m.scores = m.scores.join("-");
                        const match = await createMatch(m);
                        //console.log("Participants: ");
                        //console.log(m.participants);
                        if (m.participants) {
                            for (let key in m.participants) {
                                if (m.participants[key] && m.participants[key].player) {
                                    /* console.log("------------------------------");
                                    console.log(key);
                                    console.log(m.participants[key]);
                                    console.log(m.participants[key].player);
                                    console.log("------------------------------"); */

                                    const player = await getOrCreatePlayer(m.participants[key].player);
                                    if (player) {
                                        const teamid = key.split("_")[0] == "1" ? team1.id : team2.id;
                                        const playerTeamMatch = await createPlayerTeamMatch({
                                            ...m.participants[key],
                                            matchId: match.id,
                                            teamId: teamid,
                                            playerId: player.id,
                                        });
                                    }
                                }
                            }
                        }
                    })
                );
                return series;
            })
        );
        return result;
    } catch (error) {
        console.error("Error updating matches: ", error);
    }
}

async function getOrCreateTeam(name) {
    let foundTeam = await getValorantTeamByName(name);
    if (!foundTeam) {
        //console.log("Chiamata getTeam");
        const newTeam = await getTeam("valorant", name);
        if (newTeam.logourl) {
            newTeam.logourl = await downloadImage(newTeam.logourl, `teams/${newTeam.logo}`);
        }
        if (newTeam.logodarkurl) {
            newTeam.logodarkurl = await downloadImage(newTeam.logodarkurl, `teams/${newTeam.logodark}`);
        }
        if (!newTeam) {
            newTeam.name = name;
        }
        foundTeam = await createValorantTeam(newTeam);
    }
    return foundTeam;
}

async function getOrCreatePlayer(name) {
    let player = await getPlayerByName(name);
    if (!player) {
        const newPlayer = await getPlayer("valorant", name);
        //console.log(newPlayer);
        await new Promise((r) => setTimeout(r, 1000));
        if (newPlayer) {
            player = await createPlayer(newPlayer[0]);
        }
        console.log("_________________________");
        console.log(player);
    }
    return player;
}

module.exports = updateMatches;
