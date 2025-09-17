const cron = require("node-cron");
const { getPlayers } = require("../../api/liquipedia");
const { createPlayer, getPlayerByName, getPlayerByPagename, updatePlayer } = require("../../database/liquipedia");

cron.schedule("0 0 23 * * *", updatePlayers);

async function updatePlayers() {
    console.log("Updating Players");
    try {
        let os = 0;

        let players = await getPlayers("valorant", 1000, os);
        console.log(`Updating ${players.length} players`);
        await Promise.all(
            players.map(async (p) => {
                const found = await getPlayerByPagename(p.pagename);
                if (!found) return await createPlayer({ ...p, liquipediaid: p.id });
                return await updatePlayer(found, { ...p, liquipediaid: p.id });
            })
        );
        while (players.length > 999) {
            os += 1000;
            players = await getPlayers("valorant", 1000, os);
            console.log(`Updating ${players.length} players`);
            await Promise.all(
                players.map(async (p) => {
                    const found = await getPlayerByPagename(p.pagename);
                    if (!found) return await createPlayer({ ...p, liquipediaid: p.id });
                    return await updatePlayer(found, { ...p, liquipediaid: p.id });
                })
            );
        }
        console.log("Finished updating players");
    } catch (error) {
        console.log("Error updating players: ", error);
    }
}

module.exports = updatePlayers;
