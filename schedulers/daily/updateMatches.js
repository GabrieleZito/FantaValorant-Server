const cron = require("node-cron");
const {
    createMatchSeries,
    createMatch,
    createPlayerTeamMatch,
    getTournamentByName,
    findOrCreatePlayer,
    findOrCreateValorantTeam,
} = require("../../database/liquipedia");
const { downloadImage } = require("../../utils/misc/downloadImage");
const { getFinishedSeries } = require("../../api/liquipedia");

cron.schedule("30 0 23 * * *", updateMatches);

async function updateMatches() {
    //const data = require("../../series.json");
    console.log("Updating matches");
    try {
        // get all the future match series
        const series = await getFinishedSeries("valorant");
        console.log("series length: ", series.length);
        for (const s of series) {
            let team1, team2;
            if (s.match2opponents) {
                team1 = await getOrCreateTeam(s.match2opponents[0]);
                team2 = await getOrCreateTeam(s.match2opponents[1]);
            }

            s.winner = s.winner == 1 ? team1.id : team2.id;

            const tournament = await getTournamentByName(s.tournament);
            if (!tournament) {
                console.log("Non c'è un tournament per ", s.objectname);
            }
            const newSeries = await createMatchSeries({ ...s, tournamentId: tournament ? tournament.id : null });

            if (s.match2games) {
                for (const m of s.match2games) {
                    if (m.resulttype !== "np") {
                        m.winner = m.winner == 1 ? team1.id : team2.id;
                        m.scores = m.scores.join(" - ");
                        const newMatch = await createMatch({ ...m, matchSeriesId: newSeries.id });
                        if (m.participants) {
                            for (const [id, data] of Object.entries(m.participants)) {
                                const info = id.split("_");
                                const playerInfo = s.match2opponents[info[0] - 1].match2players.find((p) => p.name == data.player);
                                if (playerInfo && playerInfo.name) {
                                    const player = await getOrCreatePlayer(playerInfo);
                                    const newPlayerTeamMatches = await createPlayerTeamMatch({
                                        ...data,
                                        matchId: newMatch.id,
                                        playerId: player.id,
                                        teamId: info[0] == 1 ? team1.id : team2.id,
                                    });
                                } else {
                                    //console.log("No info per giocatore in match: ", s.objectname);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error updating matches: ", error);
    }
}

async function getOrCreateTeam(team) {
    try {
        let newTeam = {
            name: team.name,
            template: team.teamtemplate.template,
            pagename: team.name.split(" ").join("_"),
        };
        if (team.teamtemplate.image) {
            newTeam.logourl = await downloadImage(team.teamtemplate.imageurl, `teams/${team.teamtemplate.image}`);
        }
        if (team.teamtemplate.imagedark) {
            newTeam.logodarkurl = await downloadImage(team.teamtemplate.imagedarkurl, `teams/${team.teamtemplate.imagedark}`);
        }
        const [teamInstance, created] = await findOrCreateValorantTeam(newTeam);
        return teamInstance;
    } catch (error) {}
}

async function getOrCreatePlayer(player) {
    const [playerInstance, created] = await findOrCreatePlayer(player);
    return playerInstance;
}

module.exports = updateMatches;
