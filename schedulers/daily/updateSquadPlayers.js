const cron = require("node-cron");
const { getSquadPlayers } = require("../../api/liquipedia");
const {
    createPlayer,
    getPlayerByLiquipediaId,
    updatePlayerTeam,
    getValorantTeamByTemplate,
    createValorantTeam,
    getValorantTeamByPagename,
} = require("../../database/liquipedia");

cron.schedule("0 5 23 * * *", updateSquadPlayers);

async function updateSquadPlayers() {
    console.log("Updating SquadPlayers");
    try {
        let os = 0;

        let squadplayers = await getSquadPlayers("valorant", 1000, os);
        console.log(`Updating ${squadplayers.length} squadplayers`);

        for (const p of squadplayers) {
            let foundPlayer = await getPlayerByLiquipediaId(p.id);
            let foundTeam = (await getValorantTeamByTemplate(p.teamtemplate)) || (await getValorantTeamByPagename(p.pagename));
            if (!foundPlayer) {
                foundPlayer = await createPlayer({ liquipediaid: p.id, name: p.name, nationality: p.nationality });
            }
            if (!foundTeam) {
                foundTeam = await createValorantTeam({ pagename: p.pagename });
            }
            await updatePlayerTeam(foundPlayer, foundTeam.id);
        }

        while (squadplayers.length > 999) {
            os += 1000;
            squadplayers = await getSquadPlayers("valorant", 1000, os);
            console.log(`Updating ${squadplayers.length} squadplayers`);
            for (const p of squadplayers) {
                let foundPlayer = await getPlayerByLiquipediaId(p.id);
                let foundTeam = (await getValorantTeamByTemplate(p.teamtemplate)) || (await getValorantTeamByPagename(p.pagename));
                if (!foundPlayer) {
                    foundPlayer = await createPlayer({ liquipediaid: p.id, name: p.name, nationality: p.nationality });
                }
                if (!foundTeam) {
                    foundTeam = await createValorantTeam({ pagename: p.pagename });
                }
                await updatePlayerTeam(foundPlayer, foundTeam.id);
            }
        }
        console.log("Finished updating squadplayers");
    } catch (error) {
        console.log("Error updating squadplayers: ", error);
    }
}

module.exports = updateSquadPlayers;
