const { UserProfile, Tokens } = require("../models");

// Int -> UserProfile
exports.getUserById = async (id) => {
    try {
        const user = await UserProfile.findByPk(id);
        return user;
    } catch (error) {
        throw error;
    }
};

// String -> UserProfile
exports.getUserByUsername = async (username) => {
    try {
        const user = await UserProfile.findOne({
            where: {
                username: username,
            },
        });
        return user;
    } catch (error) {
        throw error;
    }
};

// String -> UserProfile
exports.getUserByEmail = async (email) => {
    try {
        const user = await UserProfile.findOne({
            where: {
                email: email,
            },
        });
        return user;
    } catch (error) {
        throw error;
    }
};

// {user} -> UserProfile
exports.createUser = async (user) => {
    try {
        const newUser = await UserProfile.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            passwordHash: user.passwordHash,
        });
        return newUser;
    } catch (error) {
        throw error;
    }
};

exports.setRefreshToken = async (userId, token) => {
    try {
        const user = await UserProfile.findByPk(userId);
        if (user) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            const tokenResult = await Tokens.create({ token: token, type: "refresh", expiresAt: expiresAt, userId: userId });

            return tokenResult;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        throw error;
    }
};
