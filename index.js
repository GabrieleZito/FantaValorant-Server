import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import session from "express-session";
import sequelize from "./src/config/sequelize.js";
config();

const PORT = 3000;
const app = express();
const server = http.createServer(app);
// @ts-ignore
const io = new Server(server, {
    cors: {
        // @ts-ignore
        origin: [process.env.CLIENT_URL, process.env.SOCKET_URL],
        credentials: true,
    },
});

app.use(express.json());
app.use(morgan("dev"));
app.use(
    cors({
        // @ts-ignore
        origin: [process.env.SOCKET_URL, process.env.CLIENT_URL],
        credentials: true,
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    }),
);
app.use(
    session({
        // @ts-ignore
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 1000,
        },
    }),
);
instrument(io, {
    auth: false,
    mode: "development",
});

import authRouter from "./src/routes/auth.js";
import usersRouter from "./src/routes/users.js";
app.use("/auth", authRouter);
app.use("/users", usersRouter);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        await sequelize.sync({ force: false, alter: false }); // Use { force: true } to drop tables
        console.log("Database synchronized.");

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();
