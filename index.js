const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const PassportLocal = require("passport-local");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");

const PORT = 3000;

//initialize server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//initialize database
const sequelize = require("./config/sequelize.js");
sequelize.sync({ force: false, alter: false }).then(() => console.log("DB Connected"));

//middleware
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(express.json());
app.use(
    cors({
        origin: [process.env.SOCKET_URL, process.env.CLIENT_URL],
        credentials: true,
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
            maxAge: 60 * 60 * 24 * 1,
        },
    })
);

//passport
require("./middlewares/passport-strategies.js");
app.use(passport.initialize());
app.use(passport.session());

//routes
const authRouter = require("./routes/auth.js");

app.use("/auth", authRouter);

server.listen(PORT, () => console.log("Server listening on port " + PORT));
