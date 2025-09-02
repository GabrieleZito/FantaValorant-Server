const cron = require("node-cron");
const { getPlayers } = require("../../api/liquipedia");
const { createPlayer, getPlayerByName, getPlayerByPagename } = require("../../database/liquipedia");

cron.schedule("0 0 23 * * *", updatePlayers);

async function updatePlayers() {
    console.log("Updating Players");
    try {
        let os = 0;
        let results = [];

        let players = await getPlayers("valorant", 1000, os);
        results.concat(
            await Promise.all(
                players.map(async (p) => {
                    if (!(await getPlayerByPagename(p.pagename))) return await createPlayer(p);
                })
            )
        );
        while (players.length > 999) {
            os += 1000;
            players = await getPlayers("valorant", 1000, os);
            //console.log(players.length);
            results.concat(
                await Promise.all(
                    players.map(async (p) => {
                        if (!(await getPlayerByPagename(p.pagename))) return await createPlayer(p);
                    })
                )
            );
        }
        return results;
    } catch (error) {
        console.log("Error updating players: ", error);
    }
}

module.exports = updatePlayers;
