import { DATEONLY, Model, STRING, TEXT } from "sequelize";
import sequelize from "../../config/sequelize.js";
class UserProfile extends Model {}

UserProfile.init(
    {
        firstName: {
            type: STRING,
            allowNull: false,
        },
        lastName: {
            type: STRING,
            allowNull: false,
        },
        birthDay: {
            type: DATEONLY,
            defaultValue: null,
        },
        bio: {
            type: TEXT,
            defaultValue: "",
        },
        propic: {
            type: STRING,
            defaultValue: "https://cdn-icons-png.flaticon.com/512/1177/1177568.png",
        },
        email: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
    },
);

export default UserProfile;
