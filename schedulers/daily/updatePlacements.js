const cron = require("node-cron");
const { getPlacements } = require("../../api/liquipedia");
const { getPlacementByPagename, createPlacement, updatePlacement, getTournamentByPagename } = require("../../database/liquipedia");

cron.schedule("30 0 23 * * *", updatePlacements);

async function updatePlacements() {
    console.log("Updating Placements");
    try {
        const placements = await getPlacements("valorant");
        await Promise.all(
            placements.map(async (p) => {
                const found = await getPlacementByPagename(p.pagename);
                if (!found) {
                    const tournament = await getTournamentByPagename(p.pagename);
                    if (tournament) {
                        return await createPlacement({ ...p, tournamentId: tournament.id });
                    }
                }
                return await updatePlacement(found, p);
            })
        );
    } catch (error) {
        console.error("Error updating placements: ", error);
    }
}
