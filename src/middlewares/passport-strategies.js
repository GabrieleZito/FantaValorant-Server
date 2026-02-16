import passport from "passport";
import PassportLocal from "passport-local";
import userDB from "../database/api/users.js";
import { verifyString } from "../utils/misc/encrypt.js";

passport.serializeUser((user, done) => {
    // @ts-ignore
    done(null, user.id);
});

console.log("PASSPORT");
passport.deserializeUser((id, done) => {
    userDB
        .getUserById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});

passport.use(
    new PassportLocal.Strategy(
        {
            usernameField: "email",
        },
        async (email, password, done) => {
            try {
                const user = await userDB.getUserByEmail(email);
                // @ts-ignore
                if (user && (await verifyString(password, user.passwordHash))) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                done(error);
            }
        },
    ),
);
