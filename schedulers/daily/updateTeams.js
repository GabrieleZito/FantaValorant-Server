const cron = require("node-cron");
const { getTeams } = require("../../api/liquipedia");
const { getTeamByPagename, updateValorantTeam, createValorantTeam } = require("../../database/liquipedia");
const { downloadImage } = require("../../utils/misc/downloadImage");

cron.schedule("0 0 23 * * *", updateTeams);

async function updateTeams() {
    console.log("Updating teams");
    try {
        let os = 0;
        let results = [];

        let teams = await getTeams("valorant");
        results.concat(
            await Promise.all(
                teams.map(async (t) => {
                    const found = await getTeamByPagename(t.pagename);
                    if (t.logourl) {
                        t.logourl = await downloadImage(t.logourl, `teams/${t.logo}`);
                    }
                    if (t.logodarkurl) {
                        t.logodarkurl = await downloadImage(t.logodarkurl, `teams/${t.logodark}`);
                    }
                    if (!found) {
                        return await createValorantTeam(t);
                    }
                    const hasChanges = Object.keys(t).some((key) => found[key] !== t[key]);
                    if (hasChanges) {
                        return await updateValorantTeam(found, t);
                    }
                })
            )
        );
        while (teams.length > 999) {
            os += 1000;
            teams = await getTeams("valorant", 1000, os);
            console.log(teams.length);
            results.concat(
                await Promise.all(
                    teams.map(async (t) => {
                        const found = await getTeamByPagename(t.pagename);
                        if (t.logourl) {
                            t.logourl = await downloadImage(t.logourl, `teams/${t.logo}`);
                        }
                        if (t.logodarkurl) {
                            t.logodarkurl = await downloadImage(t.logodarkurl, `teams/${t.logodark}`);
                        }
                        if (!found) {
                            return await createValorantTeam(t);
                        }
                        const hasChanges = Object.keys(t).some((key) => found[key] !== t[key]);
                        if (hasChanges) {
                            return await updateValorantTeam(found, t);
                        }
                    })
                )
            );
        }

        return results;
    } catch (error) {
        console.error("Error updating teams: ", error);
    }
}

module.exports = updateTeams;
