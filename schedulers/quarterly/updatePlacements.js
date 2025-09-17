const cron = require("node-cron");
const { getPlacements, getQuarterlyPlacements } = require("../../api/liquipedia");
const { createPlacement, getTournamentByPagename } = require("../../database/liquipedia");

cron.schedule("0 0 23 1 1,4,7,10 *", updatePlacements);

async function updatePlacements() {
    console.log("Adding Placements");
    try {
        let os = 0;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);

        let placements = await getQuarterlyPlacements("valorant", 1000, os, startDate, endDate);
        console.log(`Adding placements from ${startDate} to ${endDate}`);
        console.log(`Adding ${placements.length} placements`);
        await Promise.all(
            placements.map(async (p) => {
                const tournament = await getTournamentByPagename(p.pagename);
                return await createPlacement({ ...p, tournamentId: tournament ? tournament.id : null });
            })
        );
        while (placements.length > 999) {
            os += 1000;
            placements = await getQuarterlyPlacements("valorant", 1000, os, startDate, endDate);
            console.log(`Adding ${placements.length} placements`);
            await Promise.all(
                placements.map(async (p) => {
                    const tournament = await getTournamentByPagename(p.pagename);
                    return await createPlacement({ ...p, tournamentId: tournament ? tournament.id : null });
                })
            );
        }
    } catch (error) {
        console.error("Error Adding placements: ", error);
    }
}

module.exports = updatePlacements;
