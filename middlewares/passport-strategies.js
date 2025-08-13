const passport = require("passport");
const PassportLocal = require("passport-local");
const { getUserByEmail, getUserById } = require("../database/users");
const { verifyString } = require("../utils/misc/encrypt");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    getUserById(id)
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
                const user = await getUserByEmail(email);
                if (user && (await verifyString(password, user.passwordHash))) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                done(error);
            }
        }
    )
);
