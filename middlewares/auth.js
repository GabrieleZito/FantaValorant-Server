const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ success: false, message: "Not authenticated." });
};

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required",
        });
    }

    //TODO controllare che l'user del token corrisponde ad un user esistente e che i token corrispondano
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }
        req.user = user;
        next();
    });
};
