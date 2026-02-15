import { hash, verify } from "argon2";
import { createHash } from "crypto";

/**
 *
 * @param {string} psw
 * @returns {Promise<string>}
 */
export function hashString(psw) {
    return hash(psw);
}

/**
 *
 * @param {string} psw
 * @param {string} hashedPsw
 * @returns {Promise<boolean>}
 */
export async function verifyString(psw, hashedPsw) {
    try {
        if (await verify(hashedPsw, psw)) {
            return true;
        } else return false;
    } catch (e) {
        console.error("Error in verifyString: " + e);
        throw e;
    }
}

/**
 *
 * @param {string} token
 * @returns {string}
 */
export function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
