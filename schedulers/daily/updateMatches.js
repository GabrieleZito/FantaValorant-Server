const cron = require("node-cron");
const { getTeam, getPlayer, getFinishedSeries, getTeamByPagename, getTeamByName } = require("../../api/liquipedia");
const {
    getMatchSeriesByObjectname,
    createMatchSeries,
    getValorantTeamByName,
    createValorantTeam,
    getPlayerByName,
    createPlayer,
    createMatch,
    createPlayerTeamMatch,
    getTournamentByName,
    getPlacementByPagename,
    findOrCreatePlayer,
    findOrCreateValorantTeam,
} = require("../../database/liquipedia");
const { MatchSeries, Matches, PlayerTeamMatches } = require("../../models");
const { downloadImage } = require("../../utils/misc/downloadImage");

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
                    team1 = getOrCreateTeam(s.match2opponents[0]);
                    team2 = getOrCreateTeam(s.match2opponents[1]);
                }

                s.winner = s.winner == 1 ? team1.id : team2.id;

                const tournament = await getTournamentByName(s.tournament);

                const newSeries = await createMatchSeries({ ...s, tournamentId: tournament.id });

                if (s.match2games) {
                    const matches = await Promise.all(
                        s.match2games.map(async (m) => {
                            m.winner = m.winner == 1 ? team1.id : team2.id;
                            m.scores = m.scores.join(" - ");
                            const newMatch = await createMatch({ ...m, matchSeriesId: newSeries.id });
                            if (m.participants) {
                                for (const [id, data] of Object.entries(m.participants)) {
                                    const info = id.split("_");
                                    const playerInfo = s.match2opponents[info[0] - 1].match2players.find((p) => p.name == data.player);
                                    const player = await getOrCreatePlayer(playerInfo);
                                    const newPlayerTeamMatches = await createPlayerTeamMatch({
                                        ...data,
                                        matchId: newMatch.id,
                                        playerId: player.id,
                                        teamId: info[0] == 1 ? team1.id : team2.id,
                                    });
                                }
                            }
                        })
                    );
                }
                return s;
            })
        );
        return result;
    } catch (error) {
        console.error("Error updating matches: ", error);
    }
}

async function getOrCreateTeam(team) {
    try {
        /* let found = await getValorantTeamByName(team.name);
        if (!found) {
            let newTeam = {
                name: team.name,
                template: team.teamtemplate.template,
                pagename: team.name.split(" ").join("_"),
            };
            if (team.teamtemplate.image) {
                newTeam.logourl = await downloadImage(team.teamtemplate.imageurl, `teams/${team.teamtemplate.image}`);
            }
            if (team.teamtemplate.imagedark) {
                newTeam.logourl = await downloadImage(team.teamtemplate.imagedarkurl, `teams/${team.teamtemplate.imagedark}`);
            }
            found = await createValorantTeam(newTeam);
        } */
        let newTeam = {
            name: team.name,
            template: team.teamtemplate.template,
            pagename: team.name.split(" ").join("_"),
        };
        if (team.teamtemplate.image) {
            newTeam.logourl = await downloadImage(team.teamtemplate.imageurl, `teams/${team.teamtemplate.image}`);
        }
        if (team.teamtemplate.imagedark) {
            newTeam.logourl = await downloadImage(team.teamtemplate.imagedarkurl, `teams/${team.teamtemplate.imagedark}`);
        }
        newTeam = await findOrCreateValorantTeam(team);

        return newTeam;
    } catch (error) {}
}

/* async function getOrCreateTeam(team) {
    let foundTeam = await getValorantTeamByName(team.name);
    if (!foundTeam) {
        let newTeam = await getTeamByName("valorant", team.name);

        if (newTeam.length > 0) {
            console.log("DENTRO PRIMO IF");

            if (newTeam.logourl) {
                newTeam.logourl = await downloadImage(newTeam.logourl, `teams/${newTeam.logo}`);
            }
            if (newTeam.logodarkurl) {
                newTeam.logodarkurl = await downloadImage(newTeam.logodarkurl, `teams/${newTeam.logodark}`);
            }
        } else {
            console.log("DENTRO SECONDO IF");

            newTeam = {
                name: team.name,
                template: team.teamtemplate.template,
            };
            if (team.teamtemplate.image) {
                newTeam.logourl = await downloadImage(team.teamtemplate.imageurl, `teams/${team.teamtemplate.image}`);
            }
            if (team.teamtemplate.imagedark) {
                newTeam.logourl = await downloadImage(team.teamtemplate.imagedarkurl, `teams/${team.teamtemplate.imagedark}`);
            }
        }
        foundTeam = await createValorantTeam(newTeam);
    }
    return foundTeam;
} */

async function getOrCreatePlayer(player) {
    /* let newplayer = await getPlacementByPagename(player.name);
    if (!newplayer) {
        newplayer = await createPlayer({ pagename: player.name, nationality: player.flag });
    } */
    let newplayer = await findOrCreatePlayer(player);
    return newplayer;
}

module.exports = updateMatches;
