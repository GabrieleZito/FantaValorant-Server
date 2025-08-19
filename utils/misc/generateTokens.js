const jwt = require("jsonwebtoken");

exports.generateTokens = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
};
