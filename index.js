import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import sequelize from "./src/config/sequelize.js";
config();

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // @ts-ignore
        origin: [process.env.CLIENT_URL, "https://admin.socket.io"],
        credentials: true,
    },
});

app.use(express.json());
app.use(morgan("dev"));

instrument(io, {
    auth: false,
    mode: "development",
});

import authRouter from "./src/routes/auth.js";
app.use("/auth", authRouter);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        await sequelize.sync({ force: false, alter: false }); // Use { force: true } to drop tables
        console.log("Database synchronized.");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();
