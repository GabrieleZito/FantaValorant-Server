const express = require("express");
const router = express.Router();
const { isLoggedIn, authenticateToken } = require("../middlewares/auth");
const { LeagueSchema } = require("../utils/zod/LeagueSchema");
const {
    createLeague,
    createLeagueMember,
    checkLeagueDuplicate,
    getJoinedLeagues,
    createUserTeam,
    createLeagueTournaments,
    createAuction,
    addPlayersToAuction,
} = require("../database/leagues");
const { getTournamentsFromSeries } = require("../database/liquipedia");

router.post("/", authenticateToken, async (req, res) => {
    const data = req.body;
    const userId = req.user.id;

    const result = LeagueSchema.safeParse(data);

    //validating data
    if (result.success) {
        const newLeague = result.data;
        console.log(newLeague);
        try {
            //checking for league duplicate
            const existingLeague = await checkLeagueDuplicate(newLeague.name, newLeague.isPublic, userId);
            if (existingLeague) {
                return res.status(409).json({
                    success: false,
                    message: `${newLeague.isPublic ? "Public" : "Private"} league name already exists`,
                });
            }

            //creating league and member association
            const league = await createLeague(newLeague, userId);
            const userTeam = await createUserTeam(newLeague.teamname);
            const leagueMember = await createLeagueMember(userId, league.id, newLeague.coinsPerUser, userTeam.id);
            if (league && leagueMember) {
                const tournaments = await getTournamentsFromSeries(newLeague.tournament);
                await Promise.all(
                    tournaments.map(async (t) => {
                        await createLeagueTournaments(league.id, t.id);
                    })
                );
                const auction = await createAuction(league.id);
                await addPlayersToAuction(league.id, auction.id);

                return res.status(200).json({
                    success: true,
                    message: "League created successfully",
                    data: league,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
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

router.get("/", authenticateToken, async (req, res) => {
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
