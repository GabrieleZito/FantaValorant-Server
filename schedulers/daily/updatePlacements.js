const cron = require("node-cron");
const { getPlacements } = require("../../api/liquipedia");
const { getPlacementByPagename, createPlacement, updatePlacement, getTournamentByPagename } = require("../../database/liquipedia");

cron.schedule("30 0 23 * * *", updatePlacements);

async function updatePlacements() {
    console.log("Updating Placements");
    try {
        let os = 0;
        let results = [];

        let placements = await getPlacements("valorant");
        results.concat(
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
            )
        );
        while (placements.length > 999) {
            os += 1000;
            let placements = await getPlacements("valorant", 1000, os);
            results.concat(
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
                )
            );
        }
    } catch (error) {
        console.error("Error updating placements: ", error);
    }
}
