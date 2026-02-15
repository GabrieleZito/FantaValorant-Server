import { sign } from "jsonwebtoken";
import { UserProfile } from "../../database";

/**
 *
 * @param {UserProfile} user
 * @returns
 */
export function generateTokens(user) {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
}
