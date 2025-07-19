const argon2 = require("argon2");

exports.hashPassword = (psw) => {
    return argon2.hash(psw);
};

exports.verifyPassword = async (psw, hashedPsw) => {
    try {
        if (await argon2.verify(hashedPsw, psw)) {
            return true;
        } else return false;
    } catch (e) {
        throw e;
    }
};
