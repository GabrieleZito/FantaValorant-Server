const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/auth");
const { LeagueSchema } = require("../utils/zod/LeagueSchema");
const { createLeague, createLeagueMember, checkLeagueDuplicate, getJoinedLeagues } = require("../database/leagues");

router.post("/", isLoggedIn, async (req, res) => {
    const data = req.body;
    const userId = req.user.id;
    //console.log(data);
    const result = LeagueSchema.safeParse(data);
    if (result.success) {
        const newLeague = result.data;
        //console.log(newLeague);
        try {
            const existingLeague = await checkLeagueDuplicate(newLeague.name, newLeague.isPublic, userId);
            if (existingLeague) {
                return res.status(409).json({
                    success: false,
                    message: `${newLeague.isPublic ? "Public" : "Private"} league name already exists`,
                });
            }
            const league = await createLeague(newLeague, userId);
            const leagueMember = await createLeagueMember(userId, league.id, newLeague.coinsPerUser);
            if (league && leagueMember) {
                res.status(200).json({
                    success: true,
                    message: "League created successfully",
                    data: league,
                });
            }
        } catch (error) {
            console.error("Error creating league: " + error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: "Validation failed",
        });
    }
});

router.get("/", isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    try {
        const joinedLeagues = await getJoinedLeagues(userId);
        res.status(200).json({
            success: true,
            message: "Joined leagues retrieved",
            data: joinedLeagues,
        });
    } catch (error) {
        console.error("Error getting leagues: " + error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;
