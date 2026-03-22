import { getTeamsPS } from "../api/pandascore.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
const getTeams = async (req, res) => {
    try {
        const teams = await getTeamsPS(1, 100);
        let newteams = teams.reduce((acc, t) => {
            const key = t.location || "Other";
            if (!acc[key]) acc[key] = [];
            acc[key].push(t);
            return acc;
        }, {});
        newteams = Object.keys(newteams)
            .sort((a, b) => {
                if (a === "Other") return 1;
                if (b === "Other") return -1;
                return a.localeCompare(b);
            })
            .reduce((acc, key) => {
                acc[key] = newteams[key];
                return acc;
            }, {});
        res.status(200).json({
            success: true,
            message: "Teams retrieved",
            data: newteams,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: {},
        });
    }
};

const esportController = {
    getTeams,
};

export default esportController;
