const argon2 = require("argon2");
const crypto = require("crypto");

exports.hashString = (psw) => {
    return argon2.hash(psw);
};

exports.verifyString = async (psw, hashedPsw) => {
    try {
        if (await argon2.verify(hashedPsw, psw)) {
            return true;
        } else return false;
    } catch (e) {
        console.error("Error in verifyString: " + error);
        throw e;
    }
};

exports.hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};
