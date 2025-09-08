const cron = require("node-cron");
const { getTodayPlacements } = require("../../api/liquipedia");
const { createPlacement, getTournamentByPagename, deleteTodayPlacements } = require("../../database/liquipedia");

cron.schedule("30 0 23 * * *", updatePlacements);

async function updatePlacements() {
    console.log("Updating Placements");
    try {
        const deleted = await deleteTodayPlacements();
        console.log(`Deleted ${deleted} rows`);
        let os = 0;
        let results = [];
        let placements = await getTodayPlacements("valorant");
        console.log(`Updating ${placements.length} placements`);
        results.concat(
            await Promise.all(
                placements.map(async (p) => {
                    const tournament = await getTournamentByPagename(p.pagename);
                    return await createPlacement({ ...p, tournamentId: tournament ? tournament.id : null });
                })
            )
        );
        while (placements.length > 0) {
            os += 1000;
            placements = await getTodayPlacements("valorant", 1000, os);
            console.log(`Updating ${placements.length} placements`);
            results.concat(
                await Promise.all(
                    placements.map(async (p) => {
                        const tournament = await getTournamentByPagename(p.pagename);
                        return await createPlacement({ ...p, tournamentId: tournament ? tournament.id : null });
                    })
                )
            );
        }
    } catch (error) {
        console.error("Error updating placements: ", error);
    }
}

module.exports = updatePlacements;
