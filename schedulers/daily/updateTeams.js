const cron = require("node-cron");
const { getTeams } = require("../../api/liquipedia");
const { getTeamByPagename, updateValorantTeam, createValorantTeam } = require("../../database/liquipedia");
const { downloadImage } = require("../../utils/misc/downloadImage");

cron.schedule("0 0 23 * * *", updateTeams);

async function updateTeams() {
    console.log("Updating teams");
    try {
        const teams = await getTeams("valorant");
        const result = await Promise.all(
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
        );
    } catch (error) {
        console.error("Error updating teams: ", error);
    }
}
