const express = require("express");
const { getNextTournaments, getSeries } = require("../database/liquipedia");
const { Tournaments } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/next", async (req, res) => {
    try {
        const result = await getNextTournaments();
        const result1 = result.reduce((acc, tournament) => {
            const seriespage = tournament.seriespage.replaceAll("_", " ");
            if (!acc[seriespage]) {
                acc[seriespage] = [];
            }
            acc[seriespage].push(tournament);
            return acc;
        }, {});
        res.json({
            success: true,
            data: result1,
        });
    } catch (error) {
        console.log("Error getting next tournaments: ", error);
        res.status(500).json({
            success: false,
            message: "Internale server error",
        });
    }
});

router.get("/series", async (req, res) => {
    const filter = req.query.filter;

    //console.log(today);
    try {
        const series = await getSeries();
        res.json({
            success: true,
            data: series,
        });
    } catch (error) {
        console.error("error getting series: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;
