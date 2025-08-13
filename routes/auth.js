const express = require("express");
const { UserSchema } = require("../utils/zod/userSchema");
const { hashString } = require("../utils/misc/encrypt");
const { createUser, getUserByEmail, getUserByUsername, getUserByRefreshToken } = require("../database/users");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { setRefreshToken, revokeRefreshToken } = require("../database/tokens");
const { authenticateToken } = require("../middlewares/auth");
require("../middlewares/passport-strategies");

router.post("/register", async (req, res) => {
    const user = req.body;
    const result = UserSchema.safeParse(user);
    if (result.success) {
        try {
            //check for duplicate email
            if (await getUserByEmail(result.data.email)) {
                return res.status(400).json({
                    success: false,
                    data: { field: "email" },
                    message: "Email already used",
                });
            }

            //check for duplicate username
            if (await getUserByUsername(result.data.username)) {
                return res.status(400).json({
                    success: false,
                    data: { field: "username" },
                    message: "Username already taken",
                });
            }

            //profile creation
            const hashedPsw = await hashString(result.data.password);
            const profile = await createUser({
                firstName: result.data.firstName,
                lastName: result.data.lastName,
                email: result.data.email,
                username: result.data.username,
                passwordHash: hashedPsw,
            });

            // Generate tokens
            const { accessToken, refreshToken } = generateTokens(profile);

            // Get device info
            const { deviceInfo, ipAddress, userAgent } = getDeviceInfo(req);

            await setRefreshToken(profile.id, refreshToken, deviceInfo, ipAddress, userAgent);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const response = {
                success: true,
                data: {
                    id: profile.id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    username: profile.username,
                    birthDay: profile.birthDay,
                    propic: profile.propic,
                    bio: profile.bio,
                },
                accessToken: accessToken,
                message: "Registration completed",
            };
            req.login(response.data, (err) => {
                if (err) return next(err);
                return res.status(200).json(response);
            });
        } catch (error) {
            //error response if the registration fails
            const response = {
                success: false,
                data: {},
                message: error,
            };
            console.error(error);
            res.status(400).json(response);
        }
    } else {
        //error response if zod parsing fails
        const response = {
            success: false,
            data: {},
            message: result.error,
        };
        console.error(error);
        res.status(400).json(response);
    }
});

router.post("/login", function (req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(info);

        try {
            const { accessToken, refreshToken } = generateTokens(user);
            const { deviceInfo, ipAddress, userAgent } = getDeviceInfo(req);
            await setRefreshToken(user.id, refreshToken, deviceInfo, ipAddress, userAgent);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json({
                    success: true,
                    //TODO togliere campi on necessari da user
                    data: req.user,
                    accessToken: accessToken,
                    message: "Login Successfull",
                });
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error during login",
            });
        }
    })(req, res, next);
});

router.post("/logout", async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;

    const user = await getUserByRefreshToken(refreshToken);
    if (!user) {
        const revoked = await revokeRefreshToken(user.id);
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        //maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error logging out" });
        }
        res.json({ success: true, message: "Logged out successfully" });
    });
});

router.get("/refresh", async (req, res) => {
    const cookies = req.cookies;
    console.log("Cookies:");
    console.log(cookies);

    if (!cookies?.refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const refreshToken = cookies.refreshToken;
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        console.log("dentro jwt verify");

        if (err || user.username !== decoded.username) return res.sendStatus(403);
        const { accessToken, rToken } = generateTokens(user);
        res.status(200).json({ accessToken });
    });
});

const generateTokens = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
};

// Get device info from request
const getDeviceInfo = (req) => {
    const userAgent = req.get("User-Agent") || "";
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Simple device detection (you can enhance this)
    let deviceInfo = "Unknown Device";
    if (userAgent.includes("Mobile")) deviceInfo = "Mobile Device";
    else if (userAgent.includes("Chrome")) deviceInfo = "Chrome Browser";
    else if (userAgent.includes("Firefox")) deviceInfo = "Firefox Browser";
    else if (userAgent.includes("Safari")) deviceInfo = "Safari Browser";

    return { deviceInfo, ipAddress, userAgent };
};

module.exports = router;
