const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const PORT = 3000;

//initialize server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//initialize database
const sequelize = require("./config/sequelize.js");
sequelize.sync({ force: true, alter: false }).then(() => console.log("DB Connected"));

//TODO add csrf protection
//TODO check helmet()

//schedulers
require("./schedulers/daily/updateTournaments.js");
require("./schedulers/daily/updatePlacements.js");

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
app.use("/public", express.static("public"));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/leagues", leaguesRouter);

const { authenticateToken } = require("./middlewares/auth.js");
const { getCurrentVCTTournaments, getTournaments } = require("./api/liquipedia.js");
app.get("/prova", async (req, res) => {
    const resp = await getTournaments("valorant");
    res.json(resp);
});

server.listen(PORT, () => console.log("Server listening on port " + PORT));
