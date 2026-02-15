import userDB from "../database/api/users.js";
import { hashString } from "../utils/misc/encrypt.js";
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
                res.status(400).json({
                    success: false,
                    message: "Email already used",
                    data: { field: "email" },
                });
            }
            if (await userDB.getUserByEmail(userData.email)) {
                res.status(400).json({
                    success: false,
                    message: "Username already used",
                    data: { field: "username" },
                });
            }

            const hashedPsw = await hashString(userData.password);
            const profile = await userDB.createUser({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                username: userData.username,
                passwordHash: hashedPsw,
            });

            const { accessToken, refreshToken } = generateTokens(profile);
            const { deviceInfo, ipAddress, userAgent } = getDeviceInfo(req);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                success: false,
                data: null,
                message: "Something went wrong",
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: "Input is not formatted correctly",
            data: {
                error: result.error,
            },
        });
    }
};

const authController = {
    registerUser,
};

export default authController;
