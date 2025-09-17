const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { instrument } = require("@socket.io/admin-ui");

const PORT = 3000;

//initialize server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://admin.socket.io", process.env.CLIENT_URL],
        credentials: true,
    },
});

//Socket.io admin
instrument(io, {
    auth: false,
    mode: "development",
});

const socketHandler = require("./socket/socketHandler.js");
socketHandler(io);

//initialize database
const sequelize = require("./config/sequelize.js");
sequelize.sync({ force: false, alter: true }).then(() => console.log("DB Connected"));

//TODO add csrf protection
//TODO check helmet()

//schedulers
require("./schedulers/daily/updateTournaments.js");
require("./schedulers/daily/updatePlacements.js");
require("./schedulers/daily/updateTeams.js");
require("./schedulers/daily/updateMatches.js");

//middleware
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(
    cors({
        origin: [process.env.SOCKET_URL, process.env.CLIENT_URL],
        credentials: true,
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 1000,
        },
    })
);

//routes
const authRouter = require("./routes/auth.js");
const usersRouter = require("./routes/users.js");
const leaguesRouter = require("./routes/leagues.js");
const tournamentsRouter = require("./routes/tournaments.js");
app.use("/public", express.static("public"));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/leagues", leaguesRouter);
app.use("/tournaments", tournamentsRouter);

const { getNextTournaments } = require("./database/liquipedia.js");
const { Tournaments, Placements } = require("./models/index.js");
const { Op } = require("sequelize");
const updateSquadPlayers = require("./schedulers/daily/updateSquadPlayers.js");
const updateTournaments = require("./schedulers/daily/updateTournaments.js");
const updatePlacements = require("./schedulers/quarterly/updatePlacements.js");
const updateTeams = require("./schedulers/daily/updateTeams.js");
const updatePlayers = require("./schedulers/daily/updatePlayers.js");
const { addPlayersToAuction } = require("./database/leagues.js");
app.get("/prova", async (req, res) => {
    const placements = await addPlayersToAuction(1, 1);
    res.json(placements);
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));
