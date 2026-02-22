import jwt from "jsonwebtoken";
import { UserProfile } from "../../database/index.js";

/**
 *
 * @param {UserProfile} user
 * @returns
 */
export function generateTokens(user) {
    const payload = {
        // @ts-ignore
        id: user.id,
        // @ts-ignore
        username: user.username,
        // @ts-ignore
        email: user.email,
    };

    // @ts-ignore
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    // @ts-ignore
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
}
