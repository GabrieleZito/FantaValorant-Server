const express = require("express");
const { UserSchema } = require("../utils/zod/userSchema");
const { hashString, verifyString } = require("../utils/misc/encrypt");
const { createUser, getUserByEmail, getUserByUsername, getUserByRefreshToken, getUserById } = require("../database/users");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { setRefreshToken, getRefreshToken, invalidateToken } = require("../database/tokens");
const { getDeviceInfo } = require("../utils/misc/getDeviceInfo");
const { generateTokens } = require("../utils/misc/generateTokens");
const { email } = require("zod");
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
                    user: {
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
                },
                message: "Registration completed",
            };
            res.status(200).json(response);
            /* req.login(response.data, (err) => {
                if (err) return next(err);
                return res.status(200).json(response);
            }); */
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

/* router.post("/login", function (req, res, next) {
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
}); */

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (user && (await verifyString(password, user.passwordHash))) {
            const { accessToken, refreshToken } = generateTokens(user);
            const { deviceInfo, ipAddress, userAgent } = getDeviceInfo(req);
            await setRefreshToken(user.id, refreshToken, deviceInfo, ipAddress, userAgent);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const data = {
                id: user.id,
                email: user.email,
                username: user.username,
                bio: user.bio,
                firstName: user.firstName,
                lastName: user.lastName,
                birthDay: user.birthDay,
                propic: user.propic,
            };
            res.status(200).json({
                success: true,
                message: "login successful",
                data: { user: data, accessToken: accessToken },
            });
        } else {
            return res.status(401);
        }
    } catch (error) {
        console.error("Error il login", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.post("/logout", async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;

    if (refreshToken) {
        const token = await getRefreshToken(refreshToken);
        if (token) {
            await invalidateToken(token.id);
        }
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        //maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, message: "Logged out successfully" });
});

router.get("/refresh", async (req, res) => {
    //check if refresh token is present
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const refreshToken = cookies.refreshToken;

    //check if if there is a user associated to the refresh token
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) return res.sendStatus(403);

    //verify the token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.username !== decoded.username) return res.sendStatus(403);
        const { accessToken, _ } = generateTokens(user);
        res.status(200).json({ accessToken });
    });
});

router.get("/me", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        //No refresh token
        if (!refreshToken) {
            return res.sendStatus(401);
        }

        let user;
        const token = await getRefreshToken(refreshToken);

        //no refresh token in the db
        if (!token) {
            return res.sendStatus(401);
        }
        //token revoked
        if (token.isRevoked) {
            return res.sendStatus(401);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired refresh token",
                });
            }
            user = decoded;
        });
        const userDB = await getUserById(user.id);
        const { accessToken, _ } = generateTokens(user);
        return res.status(200).json({
            success: true,
            message: "Refresh token is valid",
            data: {
                user: {
                    id: userDB.id,
                    username: userDB.username,
                    email: userDB.email,
                    propic: userDB.propic,
                    firstName: userDB.firstName,
                    lastName: userDB.lastName,
                    bio: userDB.bio,
                    birthDay: userDB.birthDay,
                },
                accessToken: accessToken,
            },
        });
    } catch (error) {
        console.error("error in validate refresh endpoint: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;
