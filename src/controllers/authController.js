import jwt from "jsonwebtoken";
import tokensDB from "../database/api/tokens.js";
import userDB from "../database/api/users.js";
import { hashString, verifyString } from "../utils/misc/encrypt.js";
import { generateTokens } from "../utils/misc/generateTokens.js";
import { getDeviceInfo } from "../utils/misc/getDeviceInfo.js";
import { RegisterSchema } from "../utils/zod/userSchema.js";

/**
 * Controller to register a new user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const registerUser = async (req, res) => {
    const user = req.body;

    const result = RegisterSchema.safeParse(user);
    if (result.success) {
        const userData = result.data;
        try {
            // CHECKS FOR DUPLICATE USER
            if (await userDB.getUserByUsername(userData.username)) {
                return res.status(400).json({
                    success: false,
                    message: "Username already used",
                    data: { field: "username" },
                });
            }
            if (await userDB.getUserByEmail(userData.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Email already used",
                    data: { field: "email" },
                });
            }

            //PROFILE CREATION
            const hashedPsw = await hashString(userData.password);
            const profile = await userDB.createUser({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                username: userData.username,
                passwordHash: hashedPsw,
            });

            const { deviceInfo, ipAddress, userAgent } = getDeviceInfo(req);
            const { accessToken, refreshToken } = generateTokens(profile);

            // @ts-ignore
            await tokensDB.setRefreshToken(profile.id, refreshToken, deviceInfo, ipAddress, userAgent);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                success: true,
                message: "Registration complete",
                data: {
                    user: {
                        // @ts-ignore
                        id: profile.id,
                        // @ts-ignore
                        firstName: profile.firstName,
                        // @ts-ignore
                        lastName: profile.lastName,
                        // @ts-ignore
                        email: profile.email,
                        // @ts-ignore
                        username: profile.username,
                        // @ts-ignore
                        birthDay: profile.birthDay,
                        // @ts-ignore
                        propic: profile.propic,
                        // @ts-ignore
                        bio: profile.bio,
                    },
                    accessToken: accessToken,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                data: null,
                message: "Something went wrong",
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Input is not formatted correctly",
            data: {
                error: result.error,
            },
        });
    }
};

/**
 * Controller to login a user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userDB.getUserByEmail(email);
        // @ts-ignore
        if (user && (await verifyString(password, user.passwordHash))) {
            const { accessToken, refreshToken } = generateTokens(user);
            const { deviceInfo, ipAddress, userAgent } = getDeviceInfo(req);
            // @ts-ignore
            await tokensDB.setRefreshToken(user.id, refreshToken, deviceInfo, ipAddress, userAgent);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: {
                        // @ts-ignore
                        id: user.id,
                        // @ts-ignore
                        email: user.email,
                        // @ts-ignore
                        username: user.username,
                        // @ts-ignore
                        bio: user.bio,
                        // @ts-ignore
                        firstName: user.firstName,
                        // @ts-ignore
                        lastName: user.lastName,
                        // @ts-ignore
                        birthDay: user.birthDay,
                        // @ts-ignore
                        propic: user.propic,
                    },
                    accessToken: accessToken,
                },
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Wrong email or password",
                data: null,
            });
        }
    } catch (error) {
        console.error("Error in login", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null,
        });
    }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
const logoutUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;

    if (refreshToken) {
        const token = await tokensDB.getRefreshToken(refreshToken);
        if (token) {
            // @ts-ignore
            await tokensDB.invalidateToken(token.id);
        }
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        //maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, message: "Logged out successfully", data: null });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const refreshToken = cookies.refreshToken;

    //check if if there is a user associated to the refresh token
    const user = await userDB.getUserByRefreshToken(refreshToken);
    if (!user) return res.sendStatus(403);

    //verify the token
    // @ts-ignore
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        // @ts-ignore
        if (err || user.username !== decoded.username) return res.sendStatus(403);
        // @ts-ignore
        const { accessToken, _ } = generateTokens(user);
        res.status(200).json({ success: true, data: { accessToken: accessToken }, message: "" });
    });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
const me = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        //No refresh token
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided",
            });
        }

        const token = await tokensDB.getRefreshToken(refreshToken);

        //no refresh token in the db
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }
        //token revoked
        // @ts-ignore
        if (token.isRevoked) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked",
            });
        }

        // Verify and decode the token
        return new Promise((resolve) => {
            // @ts-ignore
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    return resolve(
                        res.status(401).json({
                            success: false,
                            message: "Invalid or expired refresh token",
                        }),
                    );
                }
                // @ts-ignore
                const user = await userDB.getUserById(decoded.id);
                // @ts-ignore
                const { accessToken } = generateTokens(decoded);
                return resolve(
                    res.status(200).json({
                        success: true,
                        message: "Refresh token is valid",
                        data: {
                            user: {
                                // @ts-ignore
                                id: user.id,
                                // @ts-ignore
                                username: user.username,
                                // @ts-ignore
                                email: user.email,
                                // @ts-ignore
                                propic: user.propic,
                                // @ts-ignore
                                firstName: user.firstName,
                                // @ts-ignore
                                lastName: user.lastName,
                                // @ts-ignore
                                bio: user.bio,
                                // @ts-ignore
                                birthDay: user.birthDay,
                            },
                            accessToken: accessToken,
                        },
                    }),
                );
            });
        });
    } catch (error) {
        console.error("error in validate refresh endpoint: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const authController = {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    me,
};

export default authController;
