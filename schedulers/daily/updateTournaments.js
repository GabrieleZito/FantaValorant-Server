const cron = require("node-cron");
const { getTournaments } = require("../../api/liquipedia");
const { downloadImage } = require("../../utils/misc/downloadImage");
const { createTournament, getTournamentByPagename, updateTournament, getDuplicateTournaments } = require("../../database/liquipedia");

cron.schedule("0 0 23 * * *", updateTournaments);

async function updateTournaments() {
    console.log("Updating tournaments");
    try {
        let os = 0;
        let results = [];

        let tournaments = await getTournaments("valorant");
        console.log(`Adding ${tournaments.length} tournaments`);

        results = results.concat(
            await Promise.all(
                tournaments.map(async (t) => {
                    const found = await getTournamentByPagename(t.pagename);
                    if (t.iconurl) {
                        t.iconurl = await downloadImage(t.iconurl, `tournaments/${t.icon}`);
                    }
                    if (t.icondarkurl) {
                        t.icondarkurl = await downloadImage(t.icondarkurl, `tournaments/${t.icondark}`);
                    }
                    if (t.bannerurl) {
                        t.bannerurl = await downloadImage(t.bannerurl, `tournaments/${t.banner}`);
                    }
                    if (t.bannerdarkurl) {
                        t.bannerdarkurl = await downloadImage(t.bannerdarkurl, `tournaments/${t.bannerdark}`);
                    }
                    if (!found) {
                        return await createTournament(t);
                    }
                    const hasChanges = Object.keys(t).some((key) => found[key] !== t[key]);
                    if (hasChanges) {
                        return await updateTournament(found, t);
                    }
                })
            )
        );
        while (tournaments.length > 0) {
            os += 1000;
            tournaments = await getTournaments("valorant", 1000, os);
            console.log(`Adding ${tournaments.length} tournaments`);

            results = results.concat(
                await Promise.all(
                    tournaments.map(async (t) => {
                        const found = await getTournamentByPagename(t.pagename);
                        if (t.iconurl) {
                            t.iconurl = await downloadImage(t.iconurl, `tournaments/${t.icon}`);
                        }
                        if (t.icondarkurl) {
                            t.icondarkurl = await downloadImage(t.icondarkurl, `tournaments/${t.icondark}`);
                        }
                        if (t.bannerurl) {
                            t.bannerurl = await downloadImage(t.bannerurl, `tournaments/${t.banner}`);
                        }
                        if (t.bannerdarkurl) {
                            t.bannerdarkurl = await downloadImage(t.bannerdarkurl, `tournaments/${t.bannerdark}`);
                        }
                        if (!found) {
                            return await createTournament(t);
                        }
                        const hasChanges = Object.keys(t).some((key) => found[key] !== t[key]);
                        if (hasChanges) {
                            return await updateTournament(found, t);
                        }
                    })
                )
            );
        }
        const duplicates = await getDuplicateTournaments();
        let count = 0;
        await Promise.all(
            duplicates.map(async (d) => {
                if (!d.name || !d.objectname) {
                    await d.destroy();
                    count++;
                }
            })
        );
        console.log(`Deleted ${count} duplicates`);
        return results;
    } catch (error) {
        console.error("Error in scheduler updating tournaments: ", error);
    }
}

module.exports = updateTournaments;
