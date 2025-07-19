const express = require("express");
const { UserSchema } = require("../utils/zod/userSchema");
const { hashPassword } = require("../utils/misc/encrypt");
const { createUser, getUserByEmail, getUserByUsername } = require("../database/users");
const router = express.Router();
const passport = require("passport");
require("../middlewares/passport-strategies");

router.post("/register", async (req, res) => {
    const user = req.body;
    const result = UserSchema.safeParse(user);
    if (result.success) {
        try {
            if (await getUserByEmail(result.data.email)) {
                res.status(400).json({
                    success: false,
                    data: { field: "email" },
                    message: "Email already used",
                });
            } else if (await getUserByUsername(result.data.username)) {
                res.status(400).json({
                    success: false,
                    data: { field: "username" },
                    message: "Username already taken",
                });
            } else {
                const hashedPsw = await hashPassword(result.data.password);
                const profile = await createUser({
                    firstName: result.data.firstName,
                    lastName: result.data.lastName,
                    email: result.data.email,
                    username: result.data.username,
                    passwordHash: hashedPsw,
                });

                const response = {
                    success: true,
                    data: {
                        id: profile.id,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        email: profile.email,
                        username: profile.username,
                        birthDay: profile.birthDay,
                        propic: profile.propic,
                        bio: profile.bio,
                    },
                    message: "Registration completed",
                };
                req.login(response.data, (err) => {
                    if (err) return next(err);
                    return res.status(200).json(response);
                });
            }
        } catch (error) {
            //error response if the registration fails
            const response = {
                success: false,
                data: {},
                message: error,
            };
            res.status(400).json(response);
        }
    } else {
        //error response if zod parsing fails
        const response = {
            success: false,
            data: {},
            message: result.error,
        };
        res.status(400).json(response);
    }
});

router.post("/login", function (req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            //in case the user is empty
            return res.status(401).json(info);
        }

        req.login(user, (err) => {
            if (err) return next(err);
            return res.json({
                success: true,
                data: req.user,
                message: "Login Successfull",
            });
        });
    })(req, res, next);
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error logging out" });
        }
        res.json({ success: true, message: "Logged out successfully" });
    });
});

module.exports = router;
