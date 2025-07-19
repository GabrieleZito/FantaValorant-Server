const { UserProfile } = require("../models");

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
