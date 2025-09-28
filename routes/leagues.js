const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
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
    getLeagueByName,
    addTeamToLeagueMember,
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

router.get("/:leaguename", authenticateToken, async (req, res) => {
    const parts = req.params.leaguename.split("-");
    const [name, publicFlag] = [parts.slice(0, -1).join("-"), parts.slice(-1)[0]];
    const userId = req.user.id;
    console.log(name);
    console.log(publicFlag);

    if (!name || !publicFlag || !["pub", "priv"].includes(publicFlag)) {
        return res.status(400).json({
            success: false,
            message: "Invalid URL format",
        });
    }

    const league = await getLeagueByName(name, publicFlag == "pub" ? true : false);
    if (!league) {
        return res.status(404).json({
            success: false,
            message: "No league with that name",
        });
    }

    if (league.isPublic) {
        return res.json({
            success: true,
            data: league,
        });
    }

    if (league.createdBy == userId || league.Members.some((m) => m.id == userId)) {
        return res.json({
            success: true,
            data: league,
        });
    }

    return res.status(403).json({
        success: false,
        message: "You can't access this league",
    });
});

router.post("/teams", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { teamName, leagueId } = req.body;
    if (!teamName || !leagueId) {
        return res.status(400).json({
            success: false,
            message: "Missing data",
        });
    }

    try {
        const team = await createUserTeam(teamName);
        if (!team) {
            return res.status(500).json({
                success: false,
                message: "Error creating team",
            });
        }
        const newLM = await addTeamToLeagueMember(userId, leagueId, team.id);
        if (!newLM) {
            return res.status(500).json({
                success: false,
                message: "Error creating League Member",
            });
        }
        return res.json({
            success: true,
            data: team,
        });
    } catch (error) {
        console.error("Error creating team: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.post("/auctions", authenticateToken, async (req, res) => {
    
})

module.exports = router;
